import React from 'react';
import Posts from '../Components/Posts'
import style from '../style/Home.module.css'


const Home = () => (  
    <>
        <div className={style.bg} >
            <h1 className={style.title}>Welcome to <spam style={{ fontFamily: "Dancing Script", color: "#ff9900"}}>Connect</spam></h1>
        </div>
  
        
        <h2 className="font-weight-light text-center py-3">Recent Posts</h2>
        <div className="container">
            <Posts />
        </div>
       
    </>
);

export default Home;