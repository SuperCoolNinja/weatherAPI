export interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}


export interface GeolocationData {
  results: {
    annotations: {
      timezone: {
        name: string;
        short_name: string;
        offset_string: string;
        offset_sec: number;
        is_dst: boolean;
        abbr: string;
      };
      currency: {
        name: string;
        code: string;
        symbol: string;
      };
      flag: string;
      what3words: {
        words: string;
      };
      geohash: string;
      qibla: number;
      sun: {
        rise: {
          app_date: string;
          astronomical: string;
          civil: string;
          nautical: string;
        };
        set: {
          app_date: string;
          astronomical: string;
          civil: string;
          nautical: string;
        };
      };
    };
    bounds: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
    components: {
      city: string;
      city_district: string;
      continent: string;
      country: string;
      country_code: string;
      county: string;
      postcode: string;
      state: string;
      state_code: string;
      suburb: string;
    };
    confidence: number;
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  }[];
  status: {
    code: number;
    message: string;
  };
  stay_informed: {
    blog: string;
    twitter: string;
  };
  thanks: string;
  timestamp: {
    created_http: string;
    created_unix: number;
    updated_http: string;
    updated_unix: number;
  };
}
