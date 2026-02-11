import { Switch } from '@mui/material';
import React, { useState } from 'react';

const Admincard = ({checked , onChange , name , role , email, }) => {
 
   
 
       
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mx-auto">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex space-x-4">
          <div>
            <div className="text-lg font-bold dark:text-white">{name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-200">{email}</div>
          </div>
        </div>
        <div>
            
          <select aria-hidden="true" tabIndex={-1} style={{position: 'absolute', border: 0, width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', wordWrap: 'normal'}}>
            <option value />
          </select>
        </div>
      </div>
      <div className="px-6 py-4">
        
        {!checked ? (
        <div className="text-sm text-red-600">
          ⚠️ Admin inactive — access denied
        </div>
      ):<div className="text-sm text-gray-800 dark:text-gray-200">
         When disabled, switch access is blocked and all controls are unavailable
        </div>}
      </div>
      <div className="flex justify-between items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">

           <div className='flex items-center gap-2' >
            <span className="relative flex size-3">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${checked ? "bg-green-500" : "bg-red-500"} opacity-75`}></span>
          <span className={`relative inline-flex size-3 rounded-full ${checked? "bg-green-500":"bg-red-500"}`}></span>
         </span>
          <div className='text-sm text-gray-500 dark:text-gray-200 mb-1 ' >{checked ? "Active" : "inactive"}</div>
           </div>
        </div>
        <div className="flex items-center space-x-4">
          
         <div className='text-sm text-gray-500 dark:text-gray-200 mb-1 ' > 
           <Switch 
             checked={checked}
            onChange={onChange}/>
       
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admincard;
