'use client';

import { useChat } from 'ai/react';
import MessageBox from './_components/MessageBox';
import Image from 'next/image';
import tattooBackground from './background.webp';
import ChatOptionBox from './_components/ChatOptionBox';

export default function Chat() {
  const {
    error,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    messages,
    reload,
    setInput,
    stop,
  } = useChat({
    api: '/api/use-chat-continue',
    keepLastMessageOnError: true,
  });

  return (
    <div>

      {/* Background Image */}
      <Image 
        src={tattooBackground}
        alt="Tattoo Studio Background" 
        layout="fill"
        objectFit="cover"
        quality={100}
        className="-z-10 opacity-10" // Ensures it's in the background with reduced opacity
      />



    <div className="relative flex flex-col w-full max-w-lg py-24 mx-auto stretch">

      {/* Content */}
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <MessageBox message={m} />
        </div>
      ))}

      {isLoading && (
        <div className="mt-4 text-gray-500">
          <div className="flex space-x-1">
          <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-300"></div>
        </div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={stop}
          >
            Stop
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <div className="text-red-500">An error occurred.</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={() => reload()}
          >
            Retry
          </button>
        </div>
      )}



      <div className='fixed w-full bottom-0'>
        <form onSubmit={handleSubmit}>
            {messages.length === 0 && (
            <div className='flex flex-col gap-1 text-left mb-4'>
              <button
                onClick={() => {
                  setInput('Que estilos de tatuajes puedes hacer?');
                  handleSubmit();
                }}>
                <ChatOptionBox
                  option={{
                    title: 'Estilos de tatuajes',
                    description: 'Muestra los estilos de tatuajes a elegir',
                  }}
                />
              </button>
            </div>
            )} 

            <input
              className="w-full max-w-md p-2 mb-8 border b order-gray-300 rounded-full shadow-xl"
              value={input}
              placeholder="Enviame un mensaje..."
              onChange={handleInputChange}
              disabled={isLoading || error != null}
            />

            <button type="submit" className="bg-green-500 text-white ml-2 p-2 rounded-full hover:bg-green-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.293 16.707a1 1 0 010-1.414L12.586 10 6.293 3.707a1 1 0 011.414-1.414l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
        </form>
       </div>
      </div>
    </div>

  );
}