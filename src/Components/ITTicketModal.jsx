const ITTicketModal = ({ closeModal }) => (
    <Modal title="Raise an IT Ticket" closeModal={closeModal}>
        <form className="space-y-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select id="category" className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>Hardware Issue</option>
                    <option>Software Access</option>
                    <option>Network Problem</option>
                    <option>Account/Login Issue</option>
                </select>
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input type="text" id="subject" placeholder="e.g., Cannot connect to VPN" className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea id="description" rows="4" placeholder="Please provide as much detail as possible..." className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={closeModal} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 mr-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">Submit Ticket</button>
            </div>
        </form>
    </Modal>
);

export default ITTicketModal