import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState, useCallback} from "react";
import {Tab} from "~/components/Tabs/Tabs";

const useTabQuery = (quetyName: string, tabs: Tab[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [index, setIndex] = useState(() => {
    const tabTitle = searchParams.get(quetyName);
    const tabIndex = tabs.findIndex(
      (tab) => tab.title.toLowerCase() === tabTitle?.toLowerCase(),
    );
    return tabIndex !== -1 ? tabIndex : 0;
  });

  const handleTabChange = useCallback(
    (id: number) => {
      const params = new URLSearchParams();
      params.set(quetyName, tabs[id].title.toLowerCase());
      router.push(pathname + "?" + params.toString())
      setIndex(id);
    },
    [tabs],
  );

  return [index, handleTabChange];
};

export default useTabQuery;
