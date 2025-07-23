const CabBookingModal = ({ closeModal }) => (
    <Modal title="Book a Cab" closeModal={closeModal}>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pickup Location</label>
                <input type="text" id="pickup" defaultValue="Company Office" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="dropoff" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Drop-off Location</label>
                <input type="text" id="dropoff" placeholder="e.g., 123 Main St, Anytown" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pickup Time</label>
                <input type="datetime-local" id="time" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={closeModal} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 mr-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">Request Cab</button>
            </div>
        </form>
    </Modal>
);

export default CabBookingModal