import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Table
} from 'reactstrap';

import styled from "styled-components";
import tw from "twin.macro";
import DesignIllustration from "images/design-illustration-2.svg";
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;
const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight`;
const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;
const TreactInput = tw.input`px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 
placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}}`;

function App() {
    var [stockCompanyNews, setStockCompanyNews] = useState([]);
    var [title, setTitle] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    // default is not logged  in (boolean)
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        getAllCompanyStockPriceNews();
    });

    const logout = () => {
        // remove jwt token from localstorage
        localStorage.removeItem('token');
        alert("User has been logged out!");
    }

    const register = () => {
        axios.post('http://localhost:5000/register', {
            Email: emailRegister,
            Password: passwordRegister,
        }).then(() => {
            alert("User is successfully registered.");
        }).catch(error => {
            alert(error.response.data);
        });
    };

    const login = () => {
        axios.post('http://localhost:5000/login', {
            Email: emailLogin,
            Password: passwordLogin,
        }).then((response) => {
            // if you are not authenticated
            if (!response.data.auth) {
                alert("Invalid username or password!");
                setLoginStatus(false);
            }
            else {
                // set jwt token in local storage
                localStorage.setItem("token", response.data.token);
                alert("You have successfully logged in.");
                setLoginStatus(true);
            }
        }).catch(error => {
            alert(error.response.data);
        });
    };

    const getAllCompanyStockPriceNews = () => {
        const testquery = `http://localhost:5000/getAllCompanyStockPriceNews`;
        axios.get(testquery).then((response) => {
            setStockCompanyNews(stockCompanyNews = response.data);
            console.log(stockCompanyNews);
        })
            .catch(error => {
                alert("Error message: " + error);
                console.log(error);
            });
    };

    const editCompanyName = (id) => {
        const newCompanyName = prompt("Edit company name");
        axios.post('http://localhost:5000/editCompanyName', { newCompanyName: newCompanyName, id: id }
        )
            // important to update data on client side without reloading page
            .then(() => {
                alert("Company name has been edited!");
                getAllCompanyStockPriceNews();
            })
            .catch(error => {
                alert(error.response.data);
            });
    };

    const updateQuery= (id) => {
        // store prompt input into newQuery
        const newQuery = prompt("Enter new search query");
        // config headers to get the token in local storage to be authorized
        axios
            .post('http://localhost:5000/updateQuery', { newQuery: newQuery, id: id }
            )
            .then(() => {
                getAllCompanyStockPriceNews();
            })
            .catch(error => {
                alert(error.response.data);
            });
    };

    const updateCompany = (id, stockQuery, stockTickerSymbol) => {
        axios
            .post('http://localhost:5000/updateCompany', {stockQuery: stockQuery, id: id, stockTickerSymbol: stockTickerSymbol})
            .then(() => {
                getAllCompanyStockPriceNews();
                alert("Selected company stock price and company news is updated!");
            })
            .catch(error => {
                alert(error);
            });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const query = `http://localhost:5000/saveCompanyStockPriceNews?title=${title}`;

        axios
            .get(query)
            .then(() => {
                getAllCompanyStockPriceNews();
                alert("Company is successfully added to database!");
            })
            .catch(error => {
                // error.response only shows object object
                // error.response.data shows message
                alert(error.response.data);
            });
    };

    const deleteCompany= (id) => {
        axios
            .post('http://localhost:5000/deleteCompany', { id: id }, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                },
            })
            .then(response => {
                alert(response.data);
                getAllCompanyStockPriceNews();
            })
            .catch(error => {
                alert(error.response.data);
            });
    }

    return (
        <div className="App">
            <div id="WrapperDiv" class="wrapper">
                <div id="RightDiv" class="float-right">
                    <h1>Login</h1>
                    <TreactInput
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => {
                            setEmailLogin(e.target.value);
                        }}
                    />
                    <br/>
                    <TreactInput
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                            setPasswordLogin(e.target.value);
                        }}
                    />
                    <br/><br/>
                    <Button onClick={login}>Login</Button>
                </div>

                <div id="LeftDiv" class="float-left">
                    <h1>Registration</h1>
                    <TreactInput
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) => {
                            setEmailRegister(e.target.value);
                        }}
                    />
                    <br/>
                    <TreactInput
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                            setPasswordRegister(e.target.value);
                        }}
                    />
                    <br/><br/>
                    <Button onClick={register}>Register</Button>
                </div>
            </div>

            {loginStatus &&
            (<Button style ={{ width : 100, height : 40, marginLeft : 850 }}
                onClick={logout}>Log Out
            </Button>)
            }

            <TwoColumn>
                <LeftColumn>
                    <Heading>
                        Company Stock Prices And News
                        <span tw="text-primary-500" > for you.</span>
                    </Heading>
                    <Paragraph>
                        Built using marketstack, News API, MongoDB, Heroku, ReactStrap, and Treact (React Design Template).
                    </Paragraph>
                    <Actions>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Input
                                    type="text"
                                    value = {title}
                                    placeholder="Company Name"
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button>Search</Button>
                            <p />
                        </Form>
                    </Actions>
                </LeftColumn>

                <RightColumn>
                    <IllustrationContainer>
                        <img tw="min-w-0 w-full max-w-lg xl:max-w-3xl" src={DesignIllustration} alt="Design Illustration" />
                    </IllustrationContainer>
                </RightColumn>
            </TwoColumn>

            <Container>
                <Table>
                    <tr>
                        { /*map is important for actually getting the id, which is why you can indivually select the data records*/}
                        {stockCompanyNews.map(stockCompanyValue => {
                            return (
                                <tr>
                                    <td class="company">
                                        <h1><b>{stockCompanyValue.stockCompanyName} </b></h1>
                                        <Button
                                             // _id instead of id because mongo uses _id
                                            onClick={() => {editCompanyName(stockCompanyValue._id);}}
                                        >
                                            Edit name
                                        </Button>
                                        <br /><br />
                                        <br /><br />
                                        <p>News Search Query: {stockCompanyValue.stockQuery}</p>

                                        <Button
                                            onClick={() => {updateQuery(stockCompanyValue._id);}}
                                        >
                                            Update query
                                        </Button>
                                        <br /><br />
                                        <p> Stock Ticker Symbol: {stockCompanyValue.stockTickerSymbol}</p>
                                        <p> Stock Exchange: {stockCompanyValue.stockExchangeName} </p>
                                        <p> Stock Closing Price: {stockCompanyValue.stockClosePrice}</p> 
                                        <p> Date and Time Retrieved: {stockCompanyValue.stockDate} </p>

                                        <Button
                                        onClick={() => {
                                            updateCompany(stockCompanyValue._id, stockCompanyValue.stockQuery, stockCompanyValue.stockTickerSymbol);
                                        }}
                                        >
                                        Get Latest Company Stock Price and News
                                        </Button>
                                        
                                        <br /><br />
                                    
                                        <Button
                                            onClick={() => {deleteCompany(stockCompanyValue._id);}}
                                        >
                                            Delete
                                        </Button>
                                    </td>

                                    <td>
                                        <div class="card" style={{width: '18rem'}}>
                                        <img src={stockCompanyValue.companyNews1Image} class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">{stockCompanyValue.companyNews1Title}</h5>
                                                <p class="card-text">{stockCompanyValue.companyNews1Description}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews1SourceName}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews1PublishedAt}</p>
                                            <a href={stockCompanyValue.companyNews1Url} class="btn btn-primary">Read More</a>
                                        </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div class="card" style={{width: '18rem'}}>
                                        <img src={stockCompanyValue.companyNews2Image} class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">{stockCompanyValue.companyNews2Title}</h5>
                                                <p class="card-text">{stockCompanyValue.companyNews2Description}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews2SourceName}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews2PublishedAt}</p>
                                            <a href={stockCompanyValue.companyNews2Url} class="btn btn-primary">Read More</a>
                                        </div>
                                        </div>
                                    </td>

                                    <td>
                                         <div class="card" style={{width: '18rem'}}>
                                        <img src={stockCompanyValue.companyNews3Image} class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">{stockCompanyValue.companyNews3Title}</h5>
                                                <p class="card-text">{stockCompanyValue.companyNews3Description}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews3SourceName}</p>
                                                <p class="card-text">{stockCompanyValue.companyNews3PublishedAt}</p>
                                            <a href={stockCompanyValue.companyNews3Url} class="btn btn-primary">Read More</a>
                                        </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tr>
                </Table>

            </Container>
        </div>
    );
}
export default App;