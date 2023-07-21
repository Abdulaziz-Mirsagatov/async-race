import React, { useEffect, useState } from "react";
import ViewNavigation from "../ViewNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  nextWinnersPage,
  prevWinnersPage,
  selectWinnersPageNum,
} from "../../features/pagesSlice";
import { getWinners, selectWinners } from "../../features/carsSlice";
import WinnersTable from "../WinnersTable";

const Winners = () => {
  const winnersPageNum = useSelector((state) => selectWinnersPageNum(state));
  const winners = useSelector((state) => selectWinners(state));
  const [sortedBy, setSortedBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWinners({ sortedBy, sortOrder })); // update winners if sort criteria changes
  }, [sortedBy, sortOrder]);

  // Filter out 10 winners for the current page
  const currentPageWinners = winners.slice(
    10 * (winnersPageNum - 1),
    10 * (winnersPageNum - 1) + 10
  );

  return (
    <>
      <ViewNavigation />

      <div className="winners grid">
        <h1>Winners ({winners.length})</h1>
        <p>Page #{winnersPageNum}</p>
        <WinnersTable
          winners={currentPageWinners}
          changeSort={(criteria) => {
            setSortedBy(criteria);
            if (sortOrder === "ASC") setSortOrder("DESC");
            else setSortOrder("ASC");
          }}
        />
      </div>

      <div className="pages-navigation flex">
        <button
          className="prev-btn"
          onClick={() => dispatch(prevWinnersPage())}
          disabled={winnersPageNum === 1}
        >
          Prev
        </button>
        <button
          className="next-btn"
          onClick={() => dispatch(nextWinnersPage())}
          disabled={winners.length <= winnersPageNum * 10}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Winners;
