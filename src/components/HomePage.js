//----------------------------------- Would choose backend ---------------------
// import React, { useState,useEffect } from "react";

// import "../index.css";

// const HomePage = () => {
//     const [allCountries, setAllCountries] = useState([]);
//     const [selectedCountry, setSelectedCountry] = useState("")
//     const [countryData, setCountryData] = useState(null);
//     const [error, setError] = useState("");
    
// useEffect(() =>{
//     fetchAllCountries()
// }, []);


// const fetchAllCountries = async() =>{
//     const query = 
//     `query{
//         allCountries {
//             name
//         }
//     }
//     `;
// try{
// const response = await fetch("http://ip_address:port/graphql", {
//     method: "POST",
//     headers:{"Content-Type": "application/json"},
//     body: JSON.stringify({query})
// });
// const result = await response.json();
// setAllCountries(result.data.allCountries);
// }catch(error){
//     console.error('GraphQl fetch error:', error)
//     return null
// }
// }


//     const fetchCountryDetails = async (countryName) => {
//         const query = `
//       query {
//         country(name: "${countryName}") {
//           name
//           capital
//           region
//           subregion
//           borders
//           population
//           area
//           flag
//           mapLink
//           latlng
//         }
//       }
//     `;

//         try {
//             const response = await fetch("http://ip_address:port/graphql", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ query }),
//             });

//             const result = await response.json();

//             return result.data.country;
//         } catch (error) {
//             console.error("GraphQL fetch error:", error);
//             return null;
//         }
//     };

//     const handleCountrySelect = async (e) => {
//         const countryName = e.target.value;
//         setSelectedCountry(countryName);
      
//         if (!countryName) {
//           setError("Please select a country.");
//           setCountryData(null);
//           return;
//         }
      
//         const data = await fetchCountryDetails(countryName);
      
//         if (data) {
//           setCountryData(data);
//           setError("");
//         } else {
//           setError("Country not found or error fetching data.");
//           setCountryData(null);
//         }
//       };
      


//     return (
//         <div className="container">
//             <h1 className="title">Country Info Explorer</h1>
//             <label style={{ color: 'black', fontSize: '25px', fontWeight: '600' }}>Country</label>
//             <div className="form">
//                 <select
//                     value={selectedCountry}
//                     onChange={handleCountrySelect}
//                     className="dropdown"
//                     >
//                     <option value="">--Select a country--</option>
//                     {allCountries.map((country, index) => (
//                         <option key={index} value={country.name}>
//                         {country.name}
//                         </option>
//                     ))}
//                     </select>

//             </div>

//             {error && <p className="error">{error}</p>}

//             {countryData && (
//                 <div className="infoContainer">

//                     <div class="infoText">
//                         <p><strong>Capital:</strong> {countryData.capital}</p>
//                         <p><strong>Region:</strong> {countryData.region}</p>
//                         <p><strong>Sub-Region:</strong> {countryData.subregion}</p>
//                         <p><strong>Borders:</strong> {countryData.borders?.length ? countryData.borders.join(',') : 'None'}</p>
//                         <p><strong>Population:</strong> {countryData.population}</p>
//                         <p><strong>Area:</strong> {countryData.area} km²</p>
//                         <p><strong>Latitude/Longitude:</strong> {countryData.latlng.join(',')}</p>
//                         <p>
//                             <a href={countryData.mapLink} target="_blank" rel="noopener noreferrer">Google Map Link</a>
//                         </p>

//                     </div>
//                     <img src={countryData.flag} alt="flag" className="flag" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import "../index.css";

const HomePage = () => {
    const [allCountries, setAllCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchAllCountries();
    }, []);

    const fetchAllCountries = async () => {
        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            const result = await response.json();
            const sortedCountries = result.sort((a, b) => 
                a.name.common.localeCompare(b.name.common)
            );
            setAllCountries(sortedCountries);
        } catch (error) {
            console.error('Fetch error:', error);
            setError("Failed to load countries. Please try again later.");
        }
    };

    const fetchCountryDetails = async (countryName) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
            );
            
            if (!response.ok) {
                throw new Error("Country not found");
            }
            
            const [data] = await response.json();
            
            return {
                name: data.name.common,
                capital: data.capital ? data.capital[0] : "N/A",
                region: data.region,
                subregion: data.subregion || "N/A",
                borders: data.borders || [],
                population: data.population.toLocaleString(),
                area: data.area.toLocaleString(),
                flag: data.flags.png,
                mapLink: data.maps.googleMaps,
                latlng: data.latlng,
                languages: data.languages ? Object.values(data.languages).join(", ") : "N/A",
                currencies: data.currencies ? Object.values(data.currencies).map(c => c.name).join(", ") : "N/A"
            };
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleCountrySelect = async (e) => {
        const countryName = e.target.value;
        setSelectedCountry(countryName);
      
        if (!countryName) {
            setError("Please select a country.");
            setCountryData(null);
            return;
        }
      
        const data = await fetchCountryDetails(countryName);
      
        if (data) {
            setCountryData(data);
            setError("");
        } else {
            setError("Country not found or error fetching data.");
            setCountryData(null);
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="header-content">
                    <h1>Country Info Explorer</h1>
                    <p>Discover information about countries around the world</p>
                </div>
            </header>

            <main className="main-content">
                <div className="form-section">
                    <label className="country-label">Select a Country</label>
                    <select
                        value={selectedCountry}
                        onChange={handleCountrySelect}
                        className="dropdown"
                        disabled={loading}
                    >
                        <option value="">--Select a country--</option>
                        {allCountries.map((country, index) => (
                            <option key={index} value={country.name.common}>
                                {country.name.common}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <div className="loading-spinner"></div>}
                {error && <p className="error">{error}</p>}

                {countryData && (
                    <div className="country-display">
                        <div className="country-info">
                            <h2>{countryData.name}</h2>
                            <div className="info-grid">
                                <div><span>Capital:</span> {countryData.capital}</div>
                                <div><span>Region:</span> {countryData.region}</div>
                                <div><span>Sub-Region:</span> {countryData.subregion}</div>
                                <div><span>Borders:</span> {countryData.borders.length ? countryData.borders.join(', ') : 'None'}</div>
                                <div><span>Population:</span> {countryData.population}</div>
                                <div><span>Area:</span> {countryData.area} km²</div>
                                <div><span>Coordinates:</span> {countryData.latlng.join(', ')}</div>
                                <div><span>Languages:</span> {countryData.languages}</div>
                                <div><span>Currencies:</span> {countryData.currencies}</div>
                            </div>
                            <a href={countryData.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                                View on Google Maps
                            </a>
                        </div>
                        <img src={countryData.flag} alt={`Flag of ${countryData.name}`} className="country-flag" />
                    </div>
                )}
            </main>

            <footer className="footer">
                <p>&copy; 2025 Country Info Explorer. All rights reserved.</p>
                <p>Data provided by REST Countries API</p>
            </footer>
        </div>
    );
};

export default HomePage;