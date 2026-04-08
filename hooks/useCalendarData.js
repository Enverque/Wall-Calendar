import { useState, useEffect } from 'react'

export function useCalendarData() {
  const [quotes, setQuotes] = useState([])
  const [events, setEvents] = useState([])
  const [festivals, setFestivals] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        
        const quotesRes = await fetch('/data/quotes.json')
        const quotesData = await quotesRes.json()
        setQuotes(quotesData.slice(0, 1000)) // Limit to 1000 for performance

      
        const eventsRes = await fetch('/data/historical-events.json')
        const eventsData = await eventsRes.json()
        setEvents(eventsData)

    
        const festivalsRes = await fetch('/data/festivals.json')
        const festivalsData = await festivalsRes.json()
        setFestivals(festivalsData)
      } catch (err) {
        console.error('Error loading calendar data:', err)
      }
    }

    loadData()
  }, [])

  return { quotes, events, festivals }
}
