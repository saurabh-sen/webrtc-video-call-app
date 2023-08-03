import React from 'react'
import { BsCameraVideo } from 'react-icons/bs'
import { FcVideoCall } from 'react-icons/fc'

const ButtonActions = ({ isCameraAccess, getCameraAccess, answerCall, makeCall }) => {

    return (
        <div className="actions absolute bottom-4 flex items-center justify-center gap-2 left-1/2 " style={{
            transform: "translateX(-50%)"
        }}>
            <button className="start__call border border-gray-600 text-white rounded-2xl px-5 py-2 flex items-center gap-4 bg-slate-500 bg-opacity-30 font-semibold hover:bg-opacity-10" type='button' onClick={getCameraAccess}>
                <BsCameraVideo color="white" />
                <span className='text-xs'>Open Camera</span>
            </button>
            <button className="start__call border border-gray-600 text-white rounded-2xl px-5 py-2 flex items-center gap-4 bg-slate-500 bg-opacity-30 font-semibold hover:bg-opacity-10 disabled:cursor-not-allowed disabled:text-opacity-30" type='button' disabled={!isCameraAccess} onClick={makeCall}>
                <BsCameraVideo color="white" />
                <span className='text-xs'>Create Offer</span>
            </button>
            <button className="answer__call border border-gray-600 text-white rounded-2xl px-5 py-2 flex items-center gap-4 bg-slate-500 bg-opacity-30 font-semibold hover:bg-opacity-10 disabled:cursor-not-allowed disabled:text-opacity-30" disabled={!isCameraAccess} type='button' onClick={answerCall} >
                <FcVideoCall className="text-xl" />
                <span className='text-xs'>Answer Call</span>
            </button>
        </div>
    )
}

export default ButtonActions