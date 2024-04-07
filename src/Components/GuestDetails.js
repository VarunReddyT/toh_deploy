import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

export default function GuestDetails(props) {
    props.setSignInButton(true);
    const [statusArray, setStatusArray] = useState([]);
    // const [base64Array, setBase64Array] = useState([]);
    const [blobArray, setBlobArray] = useState([]);
    const [NoData, setNoData] = useState(false);
    const [vno, setVNo] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [tollPlaza, setTollPlaza] = useState('');
    const [date, setDate] = useState('');
    const [res, setRes] = useState(false);
    const [loader, setLoader] = useState(false);
    // const [display, setDisplay] = useState(null);
    // const [vehicleNumber, setVehicleNumber] = useState(null);

    // function validateVehicleNumber(vehicleNumber) {
    //     const vehicleRegex = /^([A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4})$/;
    //     return vehicleRegex.test(vehicleNumber);
    // }
    const handleVnoChange = (event) => {
        setVNo(event.target.value);
        setPhoneNo('');
        setRes(false);
        setLoader(false);
        setNoData(false);
        setStatusArray([]);
        // setBase64Array([]);
    }
    function base64ArrayToBlobArray(base64Array, contentType) {
        return base64Array.map(base64String => {
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
    
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
    
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: contentType });
        });
      }
    

    const handleSubmit = async (e) => {
        setStatusArray([]);
        // setBase64Array([]);
        setLoader(true);
        setNoData(false);
        setRes(false);
        e.preventDefault();
        // const validateVNO = validateVehicleNumber(vehicleNumber);
        // if (!validateVNO ) {
        //     setVehicleNumber(null);
        //     setDisplay("Invalid Vehicle Number");
        //     setLoader(false);
        // }
        const response = await axios.get(`https://toh-deploy.vercel.app/guestDet`, {
            params: {
                vehicleNumber: vno,
            },
        });
        if (response.data === "No Data Found") {
            console.log("No Data Found");
            setRes(false);
            setLoader(false);
            console.log(response.data)
            setNoData(response.data);
            // setDisplay(null);
        }
        else {
            console.log(response.data)
            // setDisplay(null);
            // setNoData(false);
            setPhoneNo(response.data.userMobileNumber);
            setTollPlaza(response.data.tollPlaza);
            setDate(response.data.date);
            for (let i = 0; i < response.data.tyreStatus.length; i++) {
                setStatusArray(s => [...s, response.data.tyreStatus[i]]);

            }
            const contentType = "image/jpeg"; // Set the appropriate content type
            const convertedBlobArray = base64ArrayToBlobArray(response.data.userTyre64, contentType);
            for(let i = 0 ; i < convertedBlobArray.length ; i++){
                setBlobArray(s => [...s, convertedBlobArray[i]]);
            }

            // setBase64Array(response.data.userTyre64.map(base64String => "data:image/jpeg;base64," + base64String));
            setLoader(false)
            setRes(true);
        }
    }

    return (

        <div className="container d-flex justify-content-center align-items-center">
            <div className='rounded-4 p-4 border border-3 border-white mt-5' style={{ maxWidth: "600px" }} >
                <div className='row'>
                    <form onSubmit={handleSubmit}>
                        <div className='col'>
                            <h1>Check Your Vehicle Details</h1>
                        </div>
                        <div className="col mt-3">
                            <input type="text" onChange={handleVnoChange} className="form-control border border-black" placeholder='Vehicle Number' name="VehicleNumber" id="vehicleU" required />
                        </div>
                        <div className="d-flex mt-3 justify-content-lg-around">
                            <div>
                                <Link to="/guest" className="btn btn-warning back" id="blackbut">Go Back</Link>
                            </div>
                            
                            {res && <div className="ms-3">
                                <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#backdrop" >Result</button>
                                <div className="modal fade" id="backdrop" tabIndex="-1" aria-labelledby="backdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="backdropLabel">Result</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className=''>
                                                <p >Vehicle Number: {vno} </p>
                                                <p >Mobile Number: {phoneNo} </p>
                                                <p >Toll Plaza: {tollPlaza} </p>
                                                <p >Date: {date} </p>
                                                <hr/>
                                                </div>
                                                <p>Image(s)</p>
                                                {statusArray.map((item, index) => (
                                                    <div className='row text-center mb-4 mt-4'>
                                                        <div id="getImg" className='mb-3' >
                                                            <img className="enlarge" style={{ width: '200px', height: 'auto', borderRadius: '10px', transition: 'width 0.3s ease' }} // Shrink on mouse out
                                                                src={URL.createObjectURL(blobArray[index])} alt="Vehicle Tire" />
                                                        </div>
                                                        
                                                        <p >Classification : {item.class} </p>
                                                        <p >Confidence : {item.confidence} </p>
                                                        <hr />
                                                        <br />
                                                    </div>))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            <div className="ms-3">
                                <button type="submit" className="btn btn-primary detSub">Submit</button>
                            </div>
                            
                        </div>
                        {/* {display && <p className='mt-3 col-6 d-flex justify-content-center align-items-center alert alert-danger'>{display}</p>} */}
                        {NoData && <div className="container d-flex justify-content-center align-items-center h-50">
                                <p class="alert alert-danger">NotFound</p>
                            </div>}
                        {loader && <Loader />}

                    </form>
                </div>

            </div>
        </div>

    );
}
