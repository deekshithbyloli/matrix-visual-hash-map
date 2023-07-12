import React from 'react';
import data from './data.json';
import _ from 'lodash';
import './App.css';

const App = () => {
  // Sort the data in descending order based on hour
  const sortedData = data.sort((a, b) => b.hours[0].hour - a.hours[0].hour);

  const maxCount = 1000;

  // Extracting the date and hour information from the hour string
  const extractDateTime = (hour) => {
    const year = hour.substring(0, 4);
    const month = hour.substring(4, 6);
    const date = hour.substring(6, 8);
    const hourOfDay = hour.substring(8, 10);
    return { year, month, date, hour: hourOfDay };
  };

  // Generate the matrix visualization JSX
  const renderMatrix = () => {
    const matrix = [];

    // Get the last 15 days from the sorted data
    const last15Days = _.takeRight(sortedData, 15);

    // Generate the x-axis range
    const xAxis = Array.from({ length: 24 }, (_, index) => index);

    // Create the x-axis range JSX at the top
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

    // Loop through the days and hours to populate the matrix
    for (let i = 0; i < last15Days.length; i++) {
      const day = last15Days[i];
      const { date } = extractDateTime(day.hours[0].hour);

      // Create the row JSX
      const row = day.hours.map((hourData) => {
        const { record_count } = hourData;
        const opacity = record_count === 0 ? 0 : (record_count / maxCount) * 100;

        // Create the box JSX
        return (
          <div
            key={hourData.hour}
            className="box"
            style={{
              backgroundColor: record_count === 0 ? 'grey' : 'green',
              opacity: `${opacity}%`,
            }}
          />
        );
      });

      // Create the row container JSX
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
