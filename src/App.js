import React from 'react';
import data from './data.json';
import _ from 'lodash';
import './App.css';

const App = () => {
  const sortedData = data.sort((a, b) => b.hours[0].hour - a.hours[0].hour);
  const maxCount = 1000;

  const extractDateTime = (hour) => {
    const year = hour.substring(0, 4);
    const month = hour.substring(4, 6);
    const date = hour.substring(6, 8);
    const hourOfDay = hour.substring(8, 10);
    return { year, month, date, hour: hourOfDay };
  };

  const renderMatrix = () => {
    const matrix = [];
    const last15Days = _.takeRight(sortedData, 15);
    const xAxis = Array.from({ length: 24 }, (_, index) => index);

    const xAxisRange = (
      <div className="row">
        <div className="date" />
        {xAxis.map((hour) => (
          <div key={hour} className="box">
            {hour}
          </div>
        ))}
      </div>
    );

    matrix.push(xAxisRange);

    for (let i = 0; i < last15Days.length; i++) {
      const day = last15Days[i];
      const { date } = extractDateTime(day.hours[0].hour);

      const row = day.hours.map((hourData) => {
        const { record_count } = hourData;
        const opacity = record_count === 0 ? 0 : (record_count / maxCount) * 100;

        return (
          <div
            key={hourData.hour}
            className="box"
            style={{
              backgroundColor: record_count <= 10 ? 'grey' : 'green',
              opacity: `${opacity}%`,
            }}
          />
        );
      });

      const rowContainer = (
        <div key={i} className="row">
          <div className="date">{`${date}th`}</div>
          {row}
        </div>
      );

      matrix.push(rowContainer);
    }

    return matrix;
  };

  return <div className="matrix-container">{renderMatrix()}</div>;
};

export default App;
