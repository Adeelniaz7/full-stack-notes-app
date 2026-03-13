import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
    return (
        <div className='flex flex-col items-center justify-center mt-12 animate-fade-in'>
            <div className="w-80 h-80 flex items-center justify-center mb-6">
                <img src={imgSrc} alt='empty' className='w-full object-contain drop-shadow-2xl' />
            </div>
            <p className='w-[80%] md:w-1/2 text-base font-semibold text-slate-400 text-center leading-relaxed italic'>
                {message}
            </p>
        </div>
    );
};

export default EmptyCard;