import React from 'react'
import Queue from './Queue'
import RedisStats from './RedisStats'
import Header from './Header'
import useStore from './hooks/useStore'

export default function App({ basePath }) {
  const {
    state,
    selectedStatuses,
    setSelectedStatuses,
    retryJob,
    retryAll,
    cleanAll,
  } = useStore(basePath)

  return (
    <>
      <Header />
      <main>
        {state.loading ? (
          'Loading...'
        ) : (
          <>
            <RedisStats stats={state.data.stats} />
            {state.data.queues.map(queue => (
              <Queue
                queue={queue}
                key={queue.name}
                selectedStatus={selectedStatuses[queue.name] || 'latest'}
                selectStatus={setSelectedStatuses}
                retryJob={retryJob(queue.name)}
                retryAll={retryAll(queue.name)}
                cleanAll={cleanAll(queue.name)}
              />
            ))}
          </>
        )}
      </main>
    </>
  )
}
