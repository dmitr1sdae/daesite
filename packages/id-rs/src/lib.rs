use std::net::UdpSocket;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const BITMASK_INSTANCE: i64 = 0x3FF000;
const BITMASK_SEQUENCE: i64 = 0xFFF;

#[derive(Copy, Clone, Debug)]
pub struct Generator {
    components: Components,
    epoch: SystemTime,
}

impl Default for Generator {
    fn default() -> Self {
        let ip = get_ip().unwrap();
        let ip_split: Vec<&str> = ip.split('.').collect();
        let ip_low = ip_split[2].to_string().parse::<i64>().unwrap() << 8
            | ip_split[3].to_string().parse::<i64>().unwrap();

        Self::new(ip_low)
    }
}

impl Generator {
    pub fn new(instance: i64) -> Self {
        Self {
            components: Components::new(instance),
            epoch: UNIX_EPOCH + Duration::from_secs(1672570800),
        }
    }

    pub fn generate(&mut self) -> i64 {
        let sequence = self.components.take_sequence();

        let timestamp;
        loop {
            let now = self.epoch.elapsed().unwrap().as_millis() as i64;

            if sequence != 4095 || now > self.components.timestamp() {
                self.components.set_timestamp(now);
                timestamp = now;
                break;
            }

            std::hint::spin_loop();
        }

        let instance = self.components.instance();

        let timestamp = timestamp << 22;
        let instance = (instance << 12) & BITMASK_INSTANCE;
        timestamp | instance | sequence
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
#[repr(transparent)]
pub(crate) struct Components(i64);

impl Components {
    #[inline]
    pub(crate) const fn new(instance: i64) -> Self {
        Self((instance << 12) & BITMASK_INSTANCE)
    }

    #[inline]
    pub(crate) fn sequence(&self) -> i64 {
        self.0 & BITMASK_SEQUENCE
    }

    #[inline]
    pub(crate) fn instance(&self) -> i64 {
        (self.0 & BITMASK_INSTANCE) >> 12
    }

    #[inline]
    pub(crate) fn timestamp(&self) -> i64 {
        self.0 >> 22
    }

    pub(crate) fn set_sequence(&mut self, seq: i64) {
        let timestamp = self.timestamp() << 22;
        let instance = (self.instance() << 12) & BITMASK_INSTANCE;
        *self = Self(timestamp + instance + seq)
    }

    pub(crate) fn set_timestamp(&mut self, ts: i64) {
        let timestamp = ts << 22;
        let instance = (self.instance() << 12) & BITMASK_INSTANCE;
        *self = Self(timestamp + instance + self.sequence())
    }

    #[inline]
    pub(crate) fn take_sequence(&mut self) -> i64 {
        match self.sequence() {
            4095 => {
                self.set_sequence(0);
                4095
            }
            n => {
                self.set_sequence(n + 1);
                n
            }
        }
    }
}

fn get_ip() -> Option<String> {
    let socket = match UdpSocket::bind("0.0.0.0:0") {
        Ok(s) => s,
        Err(_) => return None,
    };

    match socket.connect("8.8.8.8:80") {
        Ok(()) => (),
        Err(_) => return None,
    };

    match socket.local_addr() {
        Ok(addr) => Some(addr.ip().to_string()),
        Err(_) => None,
    }
}
