fn main() {
    println!("cargo:rerun-if-changed=migrations");
    println!("cargo:rerun-if-changed=src/api/proto");
    println!("cargo:rerun-if-changed=../../proto/identity.proto");

    tonic_build::configure()
        .build_client(false)
        .build_server(true)
        .out_dir("./src/api/proto/")
        .compile(&["../../proto/identity.proto"], &["../../proto"])
        .unwrap_or_else(|e| panic!("Protobuf compile error: {}", e));
}
