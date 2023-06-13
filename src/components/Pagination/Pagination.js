import React, { useEffect, useState } from 'react'
import Button from '../Button'
import './Pagination.scss'

/**
 * Provides a Pagination component
 *
 * @component
 * @example
 * <Pagination
     itemsPerPage={4}
     totalItems={bigList.length}
     activePage={currentPage}
     paginate={(pageNumber) => {setCurrentPage(pageNumber)}}
     paginationInfo={'showing page 3 of 4'}
     className={{ 
       container: 'custom-pagination-conatiner',
       btnContainer: 'custom-pagination-button-container',
       btn: 'custom-pagination-button' 
     }}
   />
 * @property {Number} pages total Number of pages.
 * @property {Function} paginate Function that receives page number as an argument and is called when a pagination button is clicked.
 * @property {Object} className Object to add classes to different elements of the component.
 * @property {String} paginationInfo String or component to display additional info.
 * @property {Number} activePage the current viewing page Number to highlight the button.
 */

const MAX_PAGE_NUMBERS_SHOWN = 5

const Pagination = ({ pages, paginate, className = {}, paginationInfo = '', activePage, reference, otherProps = {} }) => {
  const [pageNumbers, setPageNumbers] = useState([])

  useEffect(() => {
    const arr = []
    let start
    let end
    const offset = Math.floor(MAX_PAGE_NUMBERS_SHOWN / 2)
    if (activePage <= offset + 1) {
      start = 1
      end = Math.min(MAX_PAGE_NUMBERS_SHOWN, pages)
    } else if (activePage >= pages - Math.floor(MAX_PAGE_NUMBERS_SHOWN / 2)) {
      start = Math.max(pages - MAX_PAGE_NUMBERS_SHOWN + 1, 1)
      end = pages
    } else {
      start = activePage - offset
      end = activePage + offset
    }
    for (let i = start; i <= end; i++) {
      arr.push(i)
    }
    setPageNumbers(arr)
  }, [pages, activePage])

  return (
    <div className={`pagination-container ${className.container || ''}`} ref={reference} {...otherProps}>
      <div className={`pagination__info ${className.info || ''}`}>{paginationInfo}</div>
      <div className={`pagination__btn-container ${className.btnContainer || ''}`}>
        {activePage !== 1 && pages > 1 && (
          <>
            <Button
              classes={`pagination__btn ${className.btn || ''}`}
              handleOnClick={() => {
                paginate(1)
              }}
            >
              {'<<'}
            </Button>
            <Button
              classes={`pagination__btn ${className.btn || ''}`}
              handleOnClick={() => {
                paginate(activePage - 1)
              }}
            >
              {'<'}
            </Button>
          </>
        )}

        {pageNumbers.map((pageNo) => (
          <Button
            classes={`pagination__btn ${className.btn || ''} ${activePage === pageNo ? 'pagination__btn--active' : ''}`}
            handleOnClick={() => {
              paginate(pageNo)
            }}
            key={pageNo}
          >
            {pageNo}
          </Button>
        ))}
        {activePage !== pageNumbers.slice(-1)[0] && pages > 1 && (
          <>
            <Button
              classes={`pagination__btn ${className.btn || ''}`}
              handleOnClick={() => {
                paginate(activePage + 1)
              }}
            >
              {'>'}
            </Button>
            <Button
              classes={`pagination__btn ${className.btn || ''}`}
              handleOnClick={() => {
                paginate(pages)
              }}
            >
              {'>>'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(Pagination)
