import React from "react";
import Car from "./Car";

const WinnersTable = ({ winners, changeSort }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th style={{ cursor: "pointer" }} onClick={() => changeSort("id")}>
            ID # <i className="fa fa-sort"></i>
          </th>
          <th>Name</th>
          <th>Car</th>
          <th style={{ cursor: "pointer" }} onClick={() => changeSort("wins")}>
            Wins <i className="fa fa-sort"></i>
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => changeSort("time")}>
            Best Time (seconds) <i className="fa fa-sort"></i>
          </th>
        </tr>
        {winners.map((winner) => (
          <tr key={winner.id}>
            <td>{winner.id}</td>
            <td>{winner.name}</td>
            <td>
              <Car style={{ fill: winner.color }} />
            </td>
            <td>{winner.wins}</td>
            <td>{winner.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WinnersTable;
