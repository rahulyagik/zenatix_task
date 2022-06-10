import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CardUi from "./Card";
import Pokemon from "./Pokemon";

const useStyles = makeStyles({
  root: {
    maxWidth: "80%",
    margin: "50px auto",
  },
  pokemonCardWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "40px 16px",
    textAlign: "center",
  },
  pokemonCard: {
    flex: "0 0 24%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "60px",
  },
  pokemonWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
  inputWrap: {
    display: "flex",
    justifyContent: "center",
    margin: "32px",
  },
  inputBtn: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  input: {
    padding: "8px",
    borderRadius: "8px",
    width: "100%",
  },
  searchBtn: {
    position: "absolute !important",
    right: "0",
    height: "-webkit-fill-available",
  },
});

const PokemonList = () => {
  const classes = useStyles();
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [pokemonType, setPokemonType] = useState([]);
  const [searchInput, setSearchInput] = useState({
    value: "",
  });
  const [dropdownFilter, setDropdownFilter] = useState("");
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const handleModal = () => {
    setOpenModal((previous) => !previous);
  };

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(initialURL);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      await loadPokemon(response.data.results);
      setLoading(false);
    }
    async function typeFilterFetch(name) {
      let response = await axios.get(`https://pokeapi.co/api/v2/type/${name}`);
      setNextUrl("");
      setPrevUrl("");
      let postLoad = response.data.pokemon.map((poke) => poke.pokemon);
      await loadPokemon(postLoad);
      setLoading(false);
    }
    if (searchInput.value === "" && dropdownFilter === "") {
      fetchData();
    } else if (dropdownFilter !== "") {
      typeFilterFetch(dropdownFilter);
    }
  }, [searchInput.value, dropdownFilter]);

  useEffect(() => {
    async function fetchPokemonType() {
      let response = await axios.get(`https://pokeapi.co/api/v2/type/`);
      setPokemonType(response.data.results);
    }
    fetchPokemonType();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await axios.get(nextUrl);
    await loadPokemon(data.data.results);
    setNextUrl(data.data.next);
    setPrevUrl(data.data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await axios.get(prevUrl);
    await loadPokemon(data.data.results);
    setNextUrl(data.data.next);
    setPrevUrl(data.data.previous);
    setLoading(false);
  };

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data?.map(async (pokemon) => {
        let pokemonRecord = await axios.get(pokemon.url);
        return pokemonRecord.data;
      })
    );
    setPokemonData(_pokemonData);
  };

  const getPokeData = (id) => {
    let pokeData = pokemonData.find((poke) => poke.id === id);
    setPokemon(pokeData);
  };

  const searchInputHandler = (event) => {
    const { name, value } = event.target;
    setSearchInput((previous) => {
      return { ...previous, [name]: value };
    });
  };

  const inputSearchHandler = async (value) => {
    if (value !== "") {
      let response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${value}/`
      );
      setPokemonData([response.data]);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.inputWrap}>
          <div className={classes.inputBtn}>
            <input
              className={classes.input}
              name="value"
              value={searchInput.value}
              onChange={searchInputHandler}
              placeholder="Search by name or id"
            />
            <Button
              variant="contained"
              onClick={() => inputSearchHandler(searchInput.value)}
              className={classes.searchBtn}
            >
              Click to Search
            </Button>
          </div>
          <FormControl sx={{ width: "100%", margin: "auto 16px" }}>
            <InputLabel id="demo-simple-select-label">
              Filter by type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dropdownFilter}
              label="Search by type"
              onChange={(e) => {
                setDropdownFilter(e.target.value);
              }}
            >
              <MenuItem value={""}>No Filter</MenuItem>
              {pokemonType.map((item) => {
                return (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name.toUpperCase()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes.pokemonCardWrapper}>
          {pokemonData.map((poke) => {
            return (
              <div
                key={poke.id}
                className={classes.pokemonCard}
                onClick={(e) => {
                  handleModal();
                  getPokeData(poke.id);
                }}
              >
                <CardUi name={poke.name} id={poke.id} />
              </div>
            );
          })}
        </div>
        <div className={classes.buttons}>
          {prevUrl !== "" ? (
            <Button variant="outlined" onClick={prev}>
              Previous
            </Button>
          ) : null}

          {nextUrl !== "" ? (
            <Button variant="contained" onClick={next}>
              Next
            </Button>
          ) : null}
        </div>
      </div>

      <Pokemon open={openModal} handle={handleModal} data={pokemon} />
    </>
  );
};

export default PokemonList;
