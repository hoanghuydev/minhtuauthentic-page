import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SEARCH_KEYWORD } from '@/config/enum';

export type TypeSearchState = {
  isOpenSearch: boolean;
  setIsOpenSearch: Dispatch<SetStateAction<boolean>> | undefined;
  setSearchValue: Dispatch<SetStateAction<string>> | undefined;
  debounceValue: string;
  saveKeyword: () => void;
};
const SearchContext = createContext<TypeSearchState | undefined>(undefined);
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debounceValue, setDebounceValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(searchValue);
    }, 350);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValue]);

  useEffect(() => {
    if (isOpenSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpenSearch]);

  const saveKeyword = useCallback(() => {
    const keyword: string | null = localStorage.getItem(SEARCH_KEYWORD);
    const keywordList: string[] = keyword ? keyword.toString().split(',') : [];
    const listOfDebounceValue: string[] = debounceValue.toString().split(' ');
    if (
      !keywordList.includes(debounceValue) &&
      listOfDebounceValue.length < 20
    ) {
      if (keywordList.length >= 10) {
        keywordList.pop();
      }
      keywordList.unshift(debounceValue);
      localStorage.setItem(SEARCH_KEYWORD, keywordList.join(','));
    }
  }, [debounceValue]);

  return (
    <SearchContext.Provider
      value={{
        isOpenSearch,
        setIsOpenSearch,
        setSearchValue,
        debounceValue,
        saveKeyword,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
export default SearchContext;
