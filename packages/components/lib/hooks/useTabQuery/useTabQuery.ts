import {useSearchParams} from "react-router-dom";
import {useState, useCallback} from "react";
import {Tab} from "~/components/Tabs/Tabs";

const useTabQuery = (quetyName: string, tabs: Tab[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [index, setIndex] = useState(() => {
    const tabTitle = searchParams.get(quetyName);
    const tabIndex = tabs.findIndex(
      (tab) => tab.title.toLowerCase() === tabTitle?.toLowerCase(),
    );
    return tabIndex !== -1 ? tabIndex : 0;
  });

  const handleTabChange = useCallback(
    (id: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set(quetyName, tabs[id].title.toLowerCase());
        return params;
      });
      setIndex(id);
    },
    [setSearchParams, tabs],
  );

  return [index, handleTabChange];
};

export default useTabQuery;
