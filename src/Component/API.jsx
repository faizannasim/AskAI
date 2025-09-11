
import React, { useEffect, useRef, useState } from 'react'
import { URL } from './constaint'



import Answer from './Answer'



function API() {
    const [question, setQuestion] = useState('')
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [recenthistory, setRecenthistory] = useState([])


    const ScrollToAns = useRef()




    useEffect(() => {
        try {
            const stored = localStorage.getItem("history")
            if (stored) {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) setRecenthistory(parsed)
            }
        } catch (err) {
            console.warn("Invalid localStorage history")
            localStorage.removeItem("history")
        }
    }, [])

    const updatedhistory = (newquestion) => {
        const updated = [newquestion, ...recenthistory]
        setRecenthistory(updated)
        localStorage.setItem('history', JSON.stringify(updated))

    }
    const deleteHistory = (index) => {
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        history.splice(index, 1)
        localStorage.setItem("history", JSON.stringify(history))
        setRecenthistory(history)

    }

    const AskQuestion = async () => {

        if (!question.trim()) {
            setError("Please Enter Your Question First")
            return
        }
        updatedhistory(question)
        setLoading(true)
        setError(null)
        setResult([])
        const payload = {
            "contents": [
                {
                    "parts": [
                        { "text": question }
                    ]
                }
            ]
        }

        try {
            const res = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            if (!res.ok) {
                throw new error("API Error")
            }
            const data = await res.json()

            let str = data.candidates[0].content.parts[0].text
            str = str.split("* ") // format in array
            str = str.map((item) => item.trim()) // actually trim
            //console.log(str)
            setResult([...result, { type: "q", text: question }, { type: "a", text: str }])


            setTimeout(() => {
                if (ScrollToAns.current) {
                    ScrollToAns.current.scrollTop = ScrollToAns.current.scrollHeight;
                }
            }, 100);


        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
            setQuestion('')
        }
    }


    return (
        <div className=' min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800  grid grid-cols-5'>
            <div className='col-span-1 bg-gray-900/80 backdrop-blur-md border-r border-gray-700 p-5'>


              <h2 className='text-gray-400 mb-4 font-bold text-xl text-center '>Recent History</h2>
                <ul className='space-y-2'>
                    {recenthistory.map((q, i) => (
                        <li key={i} className='p-2 px-4 bg-gray-800 text-white  rounded-lg  flex justify-between items-center hover:bg-gray-700 transition'>
                            <span onClick={() => setQuestion(q)} className='cursor-pointer'>{q}</span>
                            <button
                                onClick={() => deleteHistory(i)}
                                className='ml-2 '>
                                🧹🪣
                            </button>
                        </li>
                    ))}
                </ul>


            </div>


            <div className='col-span-4  flex-1 p-8 flex flex-col '>
                  <h1 className="text-cyan-400 text-4xl font-bold mb-6 text-center tracking-wide">
          Ask me Anything
        </h1>



                <div className='flex-1 overflow-auto p-5 bg-gray-800 rounded-xl mb-4 ' ref={ScrollToAns}>


                    {loading && (
                        <div className="flex justify-center items-center h-full">
              <span className="text-cyan-400 animate-pulse">AI is typing...</span>
            </div>

                    )}

                    <div>

                        <ul className='space-y-3'>
                            {result.map((item, index) => {
                                if (item.type === "q") {
                                    return (

                                        <div key={index} className='flex justify-end'>
                                            <li className='max-w-[70%] shadow-sm shadow-cyan-400/50 flex justify-between items-center p-3 px-4 bg-purple-700 text-white rounded-xl rounded-tl-md'>
                                                <Answer ans={item} totalresult={result.length} type={item.type} />
                                            </li>
                                        </div>
                                    )
                                }
                                return item.text.map((ansItem, andIndex) => (
                                    <div key={`${index}-${andIndex}`} className='flex justify-start'>
                                        <li className='max-w-[70%] p-3 bg-gray-700 text-white rounded-xl '>
                                            <Answer ans={{ type: "a", text: ansItem }} totalresult={item.text.length} />
                                        </li>

                                    </div>

                                ))
                            })}

                        </ul>

                    </div>

                </div>

                
                    <div className='flex mt-auto'>
                        <input
                            type='text'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder='Ask me Anything'
                             className="flex-1 p-4 rounded-l-xl outline-none bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
                            onKeyDown={(e) => e.key === "Enter" && AskQuestion()} // it is used for enter 
                        />


                        <button
                            onClick={AskQuestion}
                           className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 rounded-r-xl font-semibold transition"
                        >
                            Ask
                        </button>
                    </div>
                </div>
            </div>
        
    )
}

export default API






