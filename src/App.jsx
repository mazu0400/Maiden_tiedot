import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Countrylist from "./components/Countrylist";
import Countrydetail from "./components/Countrydetail";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase().trim())
  );

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minHeight: "100vh",
      }}
    >
      <h1>Country search</h1>

      <div>
        Find countries:{" "}
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Type a country name"
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        {filter === "" ? (
          <p>Start typing to search countries.</p>
        ) : countriesToShow.length > 10 ? (
          <p>Too many matches, specify another filter.</p>
        ) : countriesToShow.length > 1 ? (
          <ul>
            {countriesToShow.map((c) => (
              <li key={c.cca3}>{c.name.common}</li>
            ))}
          </ul>
        ) : countriesToShow.length === 1 ? (
          <div>
            <h2>{countriesToShow[0].name.common}</h2>
            <p>Capital: {countriesToShow[0].capital?.[0]}</p>
            <p>Population: {countriesToShow[0].population}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(countriesToShow[0].languages || {}).map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
            <img
              src={countriesToShow[0].flags.png}
              alt={`Flag of ${countriesToShow[0].name.common}`}
              style={{ width: "150px", border: "1px solid #ccc" }}
            />
          </div>
        ) : (
          <p>No matches.</p>
        )}
      </div>
    </div>
  );
};

export default App;
