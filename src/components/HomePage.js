// import React, { useState } from 'react';

// const HomePage = () => {
//     const [countryName, setCountryName] = useState('');
//     const [countryData, setCountryData] = useState(null);
//     const [error, setError] = useState('');

//     const fetchCountryData = async () => {
//         try {
//             const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
//             const data = await response.json();
//             console.log("data--------------------", data)
//             // const findExactCountry = data.find((item) => item.data.common.toLowerCase() === data.toLowerCase())
//             if (data && data.length > 0) {
//                 setCountryData(data[0])
//             } else {
//                 setError('Country not found.');
//                 setCountryData(null);
//             }
//         } catch (err) {
//             setError('Error fetching country data.');
//             setCountryData(null);
//         }
//     };

//     return (
//         <div className="container">
//             <h2>Country Info Explorer</h2>

//             <div className="inputRow">
//                 <input
//                     type="text"
//                     placeholder="Enter country name"
//                     value={countryName}
//                     onChange={(e) => setCountryName(e.target.value)}
//                     className="inputBox"
//                 />
//                 <button onClick={fetchCountryData} className="button">Get Data</button>
//             </div>

//             {error && <p className="error">{error}</p>}

//             {countryData && (
//                 <div className="infoContainer">
//                     <p><strong>Capital:</strong> {countryData.capital[0]}</p>
//                     <p><strong>Region:</strong> {countryData.region}</p>
//                     <p><strong>Population:</strong> {countryData.population}</p>
//                     <p><strong>Area:</strong> {countryData.area} km²</p>
//                     <img src={countryData.flags.png} alt="flag" className="flag" />
//                     <p>
//                         <a href={countryData.maps.googleMaps} target="_blank" rel="noopener noreferrer">Google Map Link</a>
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;


import React, { useState } from "react";
import "../index.css";

const HomePage = () => {
    const [countryName, setCountryName] = useState("");
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState("");

    const fetchCountryFromGraphQL = async (countryName) => {
        const query = `
      query {
        country(name: "${countryName}") {
          name
          capital
          region
          population
          area
          flag
          mapLink
        }
      }
    `;

        try {
            const response = await fetch("http://192.168.0.122:4000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            return result.data.country;
        } catch (error) {
            console.error("GraphQL fetch error:", error);
            return null;
        }
    };

    const handleFetchCountry = async () => {
        if (!countryName) {
            setError("Please enter a country name.");
            return;
        }

        const data = await fetchCountryFromGraphQL(countryName);
        if (data) {
            setCountryData(data);
            setError("");
        } else {
            setError("Country not found or error fetching data.");
            setCountryData(null);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Country Info Explorer</h1>
            <div className="form">
                <label>Country</label>
                <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    placeholder="Enter country name"
                />
                <button onClick={handleFetchCountry} className="button">Get Data</button>
            </div>

            {error && <p className="error">{error}</p>}

            {countryData && (
                <div className="infoContainer">
                    <p><strong>Capital:</strong> {countryData.capital}</p>
                    <p><strong>Region:</strong> {countryData.region}</p>
                    <p><strong>Population:</strong> {countryData.population}</p>
                    <p><strong>Area:</strong> {countryData.area} km²</p>
                    <img src={countryData.flag} alt="flag" className="flag" />
                    <p>
                        <a href={countryData.mapLink} target="_blank" rel="noopener noreferrer">Google Map Link</a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
