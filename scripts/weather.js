const LAT = 49.9553;
const LON = 18.5748;

async function loadWeather() {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code`
    );
    const data = await res.json();
    
    console.log(data);

    const code = data.current.weather_code;
    console.log("Weather code:", code);
    setBackground(code);
  } catch (e) {
    console.error("Nie udało się pobrać pogody", e);
    document.body.classList.add("clear");
  }
}


function setBackground(code) {
  document.body.classList.remove("clear", "rain", "snow");


  if (code >= 51 && code <= 67) {
    document.body.classList.add("rain");
    return;
  }


  if (code >= 71 && code <= 77) {
    document.body.classList.add("snow");
    return;
  }

  
  document.body.classList.add("clear");
}

loadWeather();
