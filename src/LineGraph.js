import React,{ useEffect, useState } from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: "false",
        callbacks: {
            label: function (tooltipItem, data) { 
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    parser: "MM/DD/YY",
                    tooltipItem: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) { 
                        return numeral(value).format("0a");   
                    },
                },
            },
        ],
    }
}

function LineGraph({ caseType = 'cases' }) {

    const [data, setData] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            await
                fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=20")
                    .then(response => response.json())
                    .then(data => {
                        const chartData = buildChartData(data, 'cases');
                        setData(chartData);
                        console.log(data);
                    });
        };

        fetchData();
    }, [caseType]);
    
    const buildChartData = (data, caseType = 'cases') => { 
        const chartData = [];
        let lastDataPoint;

         for(let date in data.cases) {
            if (lastDataPoint) { 
                const newDataPoint = {
                    x: date,
                    y: data[caseType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[caseType][date]
            //console.log(date);
        } 
        return chartData;
    }

    return (
        <div>
            {data?.length > 0 && (
                <Line
                options={options}   
                data={{
                datasets : [
                    {
                    backgroundColor: "red",
                    borderColor: "##CC1034",
                    data: data
                    },
                ],
                }} />
            )}
            
        </div>
    )
}

export default LineGraph