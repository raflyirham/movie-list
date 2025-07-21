"use client";

import { useMemo } from "react";
import CreateCollectionModal from "./modals/create-collection-modal";
import useModalStore from "@/stores/useModalStore";
import AddToCollectionModal from "./modals/add-to-collection-modal";

export default function MoviesModals() {
  const { currentModal } = useModalStore();

  const visibleCreateCollectionModal = useMemo(
    () => currentModal === "create-collection",
    [currentModal]
  );

  const visibleAddToCollectionModal = useMemo(
    () => currentModal === "add-to-collection",
    [currentModal]
  );

  return (
    <>
      {visibleCreateCollectionModal && <CreateCollectionModal />}
      {visibleAddToCollectionModal && <AddToCollectionModal />}
    </>
  );
}
