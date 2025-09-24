import { useEffect, useState } from "react";

const api_key = import.meta.env.VITE_SOME_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [weather, setWeather] = useState(null);

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
  const handleShowCountry = (countryName) => {
    setFilter(countryName);
  };
  const capital =
    countriesToShow.length === 1 ? countriesToShow[0].capital?.[0] : null;

  useEffect(() => {
    if (!capital || countriesToShow.length !== 1) {
      setWeather(null);
      return;
    }
    const fetchWeather = async () => {
      try {
        const [lat, lon] = countriesToShow[0].capitalInfo?.latlng || [];

        if (!lat || !lon) {
          console.warn("No coordinates for capital:", capital);
          setWeather(null);
          return;
        }
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        );
        if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
        const data = await res.json();

        console.log("Weather API response:", data);
        const icon = data.weather?.[0]?.icon;
        console.log("Weather icon code:", icon);

        setWeather({
          temp: data.main?.temp,
          wind: data.wind?.speed,
          weather: data.weather || [],
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setWeather(null);
      }
    };

    fetchWeather();
  }, [capital]);

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
              <li key={c.cca3}>
                {c.name.common}{" "}
                <button onClick={() => handleShowCountry(c.name.common)}>
                  show
                </button>
              </li>
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
            {weather && (
              <div style={{ marginTop: "1rem" }}>
                <h3>Weather in {capital}</h3>
                <p>
                  <strong>Temperature:</strong> {weather.temp} °C
                </p>

                {weather.weather.map((w, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <img
                      src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
                      alt={w.description}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/100?text=No+icon";
                      }}
                    />
                    <span>
                      {w.main} – {w.description}
                    </span>
                  </div>
                ))}

                <p>
                  <strong>Wind:</strong> {weather.wind} m/s
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>No matches.</p>
        )}
      </div>
    </div>
  );
};

export default App;
