import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => setCountryInfo(data));
  }, []);

  //USEEFFECT - Runs a piece of code based on condition

  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    // async -> send a request and wait for it to send the data

    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ));
          setCountries(countries);
          const sortedData = sortData(data);
          setTableData(sortedData);
        });
    };

    getCountryData();
    }, []);
  
  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

     fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      })
  };
  //console.log(countryInfo);

  return (
    <div className="App">
      
      <div className="app_left">
        <div className="app_header">
        <h1>COVID-19 TRACKER</h1> 
        <FormControl className="app_dropdown">
          <Select varaiant="outlined" value={country} onChange={onCountryChange}>
            {/* Loop through the countries and show a drop down list of the options */}   
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}


        {/* <MenuItem value="worldwide">Worldwide</MenuItem>
        <MenuItem value="Option 2">Option 2</MenuItem>
        <MenuItem value="Option 3">Option 3</MenuItem>
        <MenuItem value="YOOO">YOOO</MenuItem> */}
          </Select>

        </FormControl>
      </div>

        <div className="app_stats">
            {/* InfoBoxs title="Caronavirus cases" */}
            {/* InfoBoxs title="Caronavirus recoveries" */}
            {/* InfoBoxs title="Caronavirus deaths" */}
            
          <InfoBox title="Caronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recoveries" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>

        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <h3>Worldwide new cases</h3>
        <LineGraph/>
      </div>        
      
      <Card className="app_right">
        <h3>Live cases by country</h3>
        <Table countries={tableData} />
      </Card>

    </div>
  );
}

export default App;
