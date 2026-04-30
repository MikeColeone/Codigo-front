import { useEffect, useRef } from "react";
import type { SetURLSearchParams } from "react-router-dom";
import { getLowCodePage } from "@/modules/editor/api/low-code";

let bootstrappedEditorPageKey: string | null = null;

interface UseEditorBootstrapArgs {
  pageId: number;
  currentPageQueryId: string | null;
  setSearchParams: SetURLSearchParams;
  loadPageData: (
    fetchServerData?: () => Promise<{ data: any }>,
  ) => Promise<any> | void;
  initCollaboration: (
    pageId: number,
    currentUserId: number,
    currentUserName: string,
  ) => void;
  cleanupCollaboration: (pageId: number, currentUserId: number) => void;
  authUserId?: number | null;
  authUsername?: string | null;
}

export function useEditorBootstrap({
  pageId,
  currentPageQueryId,
  setSearchParams,
  loadPageData,
  initCollaboration,
  cleanupCollaboration,
  authUserId,
  authUsername,
}: UseEditorBootstrapArgs) {
  const loadPageDataRef = useRef(loadPageData);
  const setSearchParamsRef = useRef(setSearchParams);

  useEffect(() => {
    loadPageDataRef.current = loadPageData;
  }, [loadPageData]);

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  useEffect(() => {
    const pageKey = currentPageQueryId
      ? `page:${currentPageQueryId}`
      : pageId
        ? `page:${pageId}`
        : "page:draft";

    if (bootstrappedEditorPageKey === pageKey) {
      return;
    }

    bootstrappedEditorPageKey = pageKey;

    Promise.resolve(loadPageDataRef.current(getLowCodePage)).then((data) => {
      if (data?.id && !currentPageQueryId) {
        bootstrappedEditorPageKey = `page:${data.id}`;
        setSearchParamsRef.current({ id: String(data.id) }, { replace: true });
      }
    });
  }, [currentPageQueryId, pageId]);

  useEffect(() => {
    if (pageId && authUserId) {
      initCollaboration(pageId, authUserId, authUsername || "User");
    }

    return () => {
      if (pageId && authUserId) {
        cleanupCollaboration(pageId, authUserId);
      }
    };
  }, [authUserId, authUsername, cleanupCollaboration, initCollaboration, pageId]);
}
