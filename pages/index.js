import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import {Line} from "react-chartjs-2";


export default function Home({ data, lastCommit }) {
  //data init
  let stateSet = new Set();
  for(let i = 1; i < data.length; ++i){
    stateSet.add(data[i][1]);
  }
  const states = Array.from(stateSet);

  const router = useRouter();
  console.log(router.query);

  const [state, setState] = useState(router.query.name === undefined ? "Select a State" : formatString(router.query.name));
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  let filteredData = data.filter(line => { return line[1] == state });
  let filteredData2 = [];
  filteredData.forEach(line => {
    filteredData2.push([line[0], line[4], line[12]]);
  });

  const dataObject = {
    labels: getColumnByIndex(filteredData2, 0),
    datasets: [
      {
        label: "Vaccines Provided",
        data: cleanZeros(getColumnByIndex(filteredData2, 1)),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y-axis-1",
      },
      {
        label: "Vaccines Administered",
        data: cleanZeros(getColumnByIndex(filteredData2, 2)),
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y-axis-2",
      },
    ]
  }

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          ticks: {
            suggestedMax: Math.max.apply(Math, getColumnByIndex(filteredData2, 1)),
            beginAtZero: true,
          }
        },
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-2",
          ticks: {
            suggestedMax: Math.max.apply(Math, getColumnByIndex(filteredData2, 1)),
            beginAtZero: true,
          }
        }
      ]
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>COVID-19 Vaccine Tracker</title>
      </Head>

      <main className={styles.main}>
        <Alert color="info">
          <h1>COVID-19 Vaccine Tracker</h1>
        </Alert>
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>
            {state}
          </DropdownToggle>
          <DropdownMenu>
            {states.map(state => (
              <DropdownItem 
                key={states.indexOf(state)}
                onClick={() => {
                  setState(state);
                  router.push({ query: { name: state } });
                }}
              >
                {state}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        <div className={styles.chart}>
          <Line data={dataObject} options={options}></Line>
        </div>
        <div className={styles.footer}>
          <Container>
            <Row>
              <Col>Data last updated <a href="https://github.com/govex/COVID-19/blob/master/data_tables/vaccine_data/raw_data/vaccine_data_us_state_timeline.csv" rel="noopener noreferrer" target="_blank">{lastCommit}</a>.</Col>
              <Col><a href="https://github.com/wkoury/c19-vaccines" rel="noopener noreferrer" target="_blamk">GitHub</a></Col>
            </Row>
          </Container>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const dataFunc = require("../utils/url");  
  const data = await dataFunc.getData();
  const commitsRes = await dataFunc.getCommits();
  const commits = JSON.parse(commitsRes);

  return { props: { data, lastCommit: commits[0].commit.author.date } } //data is basically a giant 2D array of the csv file from https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/raw_data/vaccine_data_us_state_timeline.csv
}

const getColumnByIndex = (matrix, index) => { //matrix MUST be a 2D array
  let ret = [];
  matrix.forEach(row => {
   ret.push(row[index]);
  });

  return ret;
}

//for vaccines provided, clean up zeroes
const cleanZeros = array => {
  for(let i = 0; i < array.length; ++i){
    if(array[i] === "" && i > 0){
      array[i] = array[i - 1];
    }
  }

  return array;
}

const formatString = str => {
  str = str.toLowerCase();
  str = str.split("");
  str[0] = str[0].toUpperCase();
  str = str.join("");
  return str;
}
