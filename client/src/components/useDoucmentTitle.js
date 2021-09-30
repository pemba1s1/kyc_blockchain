import { useRef, useEffect } from 'react'

function useDocumentTitle(title) {

  useEffect(() => {
    document.title = title;
  });
}

export default useDocumentTitle