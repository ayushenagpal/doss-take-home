import '../style/ReadMe.css'

export default function ReadMe() {
  return (
    <div>
      <h2>Doss Take Home Technical Challenge</h2>
      <p>
        Welcome to the Doss take home technical challenge. This is meant mostly as a way for us to
        evaluate your ability to work in a foreign codebase on some technical tasks - it is meant to
        be a much more relevant version of a technical interview than the classic algorithmic
        interview.
      </p>
      <h4>Who are we?</h4>
      <p>
        Some background information on Doss - we are focused on building a cloud collaboration
        platform to help operations teams (Supply Chain / Finance / Logistics) manage internal and
        external processes. Our customers use our platform to visualize and interact with their
        entire supply chain.
      </p>
      <h4>What is your job?</h4>
      <p>
        On our platform, our customers interface with a series of nested "workspaces" that represent
        different parts of their supply chain (i.e. factories, warehouses, suppliers, etc). Each of
        these workspaces is made up of various visualizations such as tables, charts, graphs, and
        file viewers.
      </p>
      <p>
        Your high level task will be to use the existing codebase to flesh out a viewer for a list
        of workspaces and their corresponding tables. In other words, you are building our "
        <b>Dosspace</b>."
      </p>
      <h4>The details</h4>
      <p>
        The application should help users track data across their workspaces. Specifically, we are
        looking for the following to be done:
      </p>
      <ul>
        <li>There's UT(s) failing. Figure out why and fix it!</li>
        <li>Add a new API endpoint to delete rows (Shipments) from a table (ShipmentTable)</li>
        <li>Add validation around user-inputs to make sure values make sense</li>
        <li>Add a new endpoint to duplicate a table (ShipmentTable)</li>
      </ul>
      <h4>Evaluation criteria</h4>
      <ul>
        <li>
          <b>Functionality:</b> The app should work as the instructions dictate. None of the core
          flows should cause any errors. Anything extra is always a bonus, but not necessary.
        </li>
        <li>
          <b>Coding style:</b> You should follow general best practices and adhere to the standards
          set in the codebase. If any significant deviants are made, feel free to indicate the
          reasoning in comments or in your submission.
        </li>
      </ul>
      <h4>Getting started</h4>
      <p>
        Since you already got to this point, you clearly have the application running! The next
        place to look would be to familiarize yourself with the codebase - all relevant web
        components are under the <i>components.tsx</i> and all the core API functions are in{' '}
        <i>app.ts</i>. Feel free to ask questions along the way, happy to help if you get stuck or
        need any guidance. But this is also intentionally open-ended, and we're excited to see what
        direction you take it!
      </p>
    </div>
  )
}
