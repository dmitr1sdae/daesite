"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback, useState} from "react";

const useTabQuery = (quetyName: string, tabs: any[]) => {
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
      router.push(pathname + "?" + params.toString());
      setIndex(id);
    },
    [tabs],
  );

  return [index, handleTabChange];
};

export {useTabQuery};
