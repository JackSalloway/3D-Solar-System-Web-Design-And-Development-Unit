// This file contains all the relevant data for each planet. Using this, I only have to create one html file for every planet page
export const planetData = {
    mercury: {
        name: "Mercury",
        diameter: "4,879 km",
        mass: "3.30 x 10^23 kg",
        gravity: "3.7 m/s²",
        distanceFromSun: "57.9 million km",
        orbitalPeriod: "88 Earth days",
        image: "../images/mercury.jpg",
        description:
            "Mercury is the smallest planet in our solar system and closest to the Sun. It has a rocky surface and experiences extreme temperatures.",
        numberOfMoons: "0",
        surfaceTemperature: "-173 to 427 °C",
        interestingFact:
            "Mercury has a very thin atmosphere, which means it cannot retain heat. This results in drastic temperature changes between day and night.",
    },
    venus: {
        name: "Venus",
        diameter: "12,104 km",
        mass: "4.87 x 10^24 kg",
        gravity: "8.87 m/s²",
        distanceFromSun: "108.2 million km",
        orbitalPeriod: "225 Earth days",
        image: "../images/venus.jpg",
        description:
            "Venus is the second planet from the Sun and is often called Earth's sister planet due to its similar size. It has a thick atmosphere that traps heat, making it the hottest planet in our solar system.",
        numberOfMoons: "0",
        surfaceTemperature: "462 °C",
        interestingFact:
            "Venus is the hottest planet in our solar system, even though Mercury is closer to the Sun.",
    },
    earth: {
        name: "Earth",
        diameter: "12,742 km",
        mass: "5.97 x 10^24 kg",
        gravity: "9.81 m/s²",
        distanceFromSun: "149.6 million km",
        orbitalPeriod: "365.25 Earth days",
        image: "../images/earth.jpg",
        description:
            "Earth is the third planet from the Sun and the only known planet to support life. It has a diverse climate and a rich variety of ecosystems.",
        numberOfMoons: "1",
        surfaceTemperature: "15 °C",
        interestingFact: "Earth is the only planet known to support life.",
    },
    mars: {
        name: "Mars",
        diameter: "6,779 km",
        mass: "6.42 x 10^23 kg",
        gravity: "3.71 m/s²",
        distanceFromSun: "227.9 million km",
        orbitalPeriod: "687 Earth days",
        image: "../images/mars.jpg",
        description:
            "Mars is the fourth planet from the Sun and is often called the Red Planet due to its reddish appearance. It has a thin atmosphere and is home to the largest volcano in the solar system, Olympus Mons.",
        numberOfMoons: "2",
        surfaceTemperature: "-65 °C",
        interestingFact:
            "Mars has the largest volcano in the solar system, Olympus Mons.",
    },
    jupiter: {
        name: "Jupiter",
        diameter: "139,820 km",
        mass: "1.90 x 10^27 kg",
        gravity: "24.79 m/s²",
        distanceFromSun: "778.5 million km",
        orbitalPeriod: "12 Earth years",
        image: "../images/jupiter.jpg",
        description:
            "Jupiter is the largest planet in our solar system and is known for its Great Red Spot, a giant storm that has been raging for centuries. It has a strong magnetic field and dozens of moons.",
        numberOfMoons: "79",
        surfaceTemperature: "-110 °C",
        interestingFact: "Jupiter is the largest planet in our solar system.",
    },
    saturn: {
        name: "Saturn",
        diameter: "116,460 km",
        mass: "5.68 x 10^26 kg",
        gravity: "10.44 m/s²",
        distanceFromSun: "1.43 billion km",
        orbitalPeriod: "29 Earth years",
        image: "../images/saturn.jpg",
        description:
            "Saturn is the second-largest planet in our solar system and is famous for its stunning ring system, which is made up of ice and rock particles. It has a low density and could float in water.",
        numberOfMoons: "82",
        surfaceTemperature: "-178 °C",
        interestingFact:
            "Saturn has the most extensive ring system in our solar system.",
    },
    uranus: {
        name: "Uranus",
        diameter: "50,724 km",
        mass: "8.68 x 10^25 kg",
        gravity: "8.69 m/s²",
        distanceFromSun: "2.87 billion km",
        orbitalPeriod: "84 Earth years",
        image: "../images/uranus.jpg",
        description:
            "Uranus is the seventh planet from the Sun and is unique for its tilted axis, which causes it to rotate on its side. It has a blue-green color due to methane in its atmosphere.",
        numberOfMoons: "27",
        surfaceTemperature: "-195 °C",
        interestingFact:
            "Uranus rotates on its side, making it unique in our solar system.",
    },
    neptune: {
        name: "Neptune",
        diameter: "49,244 km",
        mass: "1.02 x 10^26 kg",
        gravity: "11.15 m/s²",
        distanceFromSun: "4.5 billion km",
        orbitalPeriod: "165 Earth years",
        image: "../images/neptune.jpg",
        description:
            "Neptune is the eighth and farthest planet from the Sun. It has a deep blue color and is known for its strong winds, which can reach speeds of up to 2,100 km/h. It also has a faint ring system and several moons.",
        numberOfMoons: "14",
        surfaceTemperature: "-200 °C",
        interestingFact: "Neptune has the strongest winds in our solar system.",
    },
};
