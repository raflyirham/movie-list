"use client";

import { useMemo } from "react";
import CreateCollectionModal from "./modals/create-collection-modal";
import useModalStore from "@/stores/useModalStore";

export default function MoviesModals() {
  const { currentModal } = useModalStore();

  const visibleCreateCollectionModal = useMemo(
    () => currentModal === "create-collection",
    [currentModal]
  );

  return <>{visibleCreateCollectionModal && <CreateCollectionModal />}</>;
}
