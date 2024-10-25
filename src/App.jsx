import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";

const P = styled.p`
  color: #000000;
  opacity: 0.5;
  text-align: center;
`;

const Input = styled.input`
  color: #000000;
  background-color: #ffffff;
  border: solid 1px #000000;
  border-radius: 5px;
  font-size: 20px;
  margin: 10px;
  padding: 10px;
`;

const ButtonChangeColor = styled.button`
  color: #000000;
  background-color: #ffffff;
  border: solid 1px #000000;
  border-radius: 5px;
  font-size: 20px;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
`;

const Button = styled.button`
  color: #000000;
  border: none;
  opacity: 0.5;
  font-size: 50px;
  cursor: pointer;
`;

const Container = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const H1 = styled.h1`
  color: #000000;
  font-size: 50px;
`;

function App() {
  const [color, setColor] = useState("");
  const [colorName, setColorName] = useState("");
  const colors = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];

  function recordKey(e) {
    if (e.key === "Enter") {
      let enteredColor = e.target.value.trim();
      if (CSS.supports("color", enteredColor)) {
        let capitalFirstLetter = enteredColor.charAt(0).toUpperCase();
        enteredColor = capitalFirstLetter + enteredColor.slice(1).toLowerCase();
        setColorName(enteredColor);
        setColor(enteredColor);
        return;
      } else {
        enteredColor = enteredColor.toUpperCase();
        if (!enteredColor.startsWith("#")) enteredColor = `#${enteredColor}`;
        if (/^#[0-9A-F]{6}$/i.test(enteredColor)) {
          setColor(enteredColor);
          return;
        } else {
          alert("Please enter a valid hex color code!");
          return;
        }
      }
    }
  }
  function removeHash(color) {
    let colorNoHash = color.slice(1);

    return colorNoHash;
  }

  function darkenColor(color) {
    const nonHashColor = removeHash(color);
    let newColor = "";

    for (let i = 0; i < nonHashColor.length; i++) {
      let char = nonHashColor.charAt(i);
      let newChar = char === "0" ? "0" : colors[colors.indexOf(char) - 1];
      newColor += newChar;
    }
    let darkenedColor = `#${newColor}`;
    setColor(darkenedColor);
    removeHash(darkenedColor);
    return darkenedColor;
  }

  function lightenColor(color) {
    const nonHashColor = removeHash(color);
    let newColor = "";

    for (let i = 0; i < nonHashColor.length; i++) {
      let char = nonHashColor.charAt(i);
      let newChar = char === "F" ? "F" : colors[colors.indexOf(char) + 1];
      newColor += newChar;
    }

    let lightenedColor = `#${newColor}`;
    setColor(lightenedColor);
    removeHash(lightenedColor);
    return lightenedColor;
  }

  function copyText(e) {
    navigator.clipboard.writeText(color);
    alert(`Color ${colorName} copied to clipboard`);
    e.stopPropagation();
  }

  function getColorName(colorId) {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://www.thecolorapi.com/id?hex=${colorId}`
        );
        const data = await res.json();
        console.log(data.name.value);
        setColorName(data.name.value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }

  function handleClick(e) {
    if (e.target === e.currentTarget) {
      let randomColor = "#";
      for (let j = 0; j < 6; j++) {
        randomColor += colors[Math.floor(Math.random() * colors.length)];
      }
      setColor(randomColor);
    }
  }

  useEffect(() => {
    const savedColor = localStorage.getItem("color");
    if (savedColor) {
      setColor(savedColor);
    }
  }, []);

  useEffect(() => {
    getColorName(removeHash(color));
    localStorage.setItem("color", color);
  }, [color]);

  return (
    <Container onClick={handleClick} style={{ backgroundColor: color }}>
      <div>
        <H1>{colorName}</H1>
        <Button onClick={copyText} style={{ backgroundColor: color }}>
          {color}
        </Button>
        <P>Click the text to copy the color</P>
        <ButtonChangeColor onClick={() => darkenColor(color)}>
          Darken Color
        </ButtonChangeColor>
        <Input
          placeholder="Enter your a hex code"
          type="text"
          onKeyDown={recordKey}
        ></Input>
        <ButtonChangeColor onClick={() => lightenColor(color)}>
          Lighten Color
        </ButtonChangeColor>
      </div>
    </Container>
  );
}
export default App;
