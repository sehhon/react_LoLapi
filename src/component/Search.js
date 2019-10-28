import React from 'react';




const Search = ({ handleChange, getData }) => (
    <div >
        <input type="text" placeholder="id입력" onChange={handleChange} />
        <button className="btn btn-default" onClick={getData}> 검색 </button>
        
    </div>


);



export default Search;