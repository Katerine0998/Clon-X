export const SupportPage = () => {
    return (
        <>
            <section className="py-5">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8 col-xxl-7">
                            <span className="text-muted">Let's Talk</span>
                            <h2 className="display-5 fw-bold mb-3">Contact Us</h2>
                            <p className="lead">Lorem ipsum dolor, sit amet elit Quamnitm veniam dicta, quos nemo minima nulla ducimus officii nulla ducimus officiis! Lorem ipsum dolor, sit amet elit Quamnitm.</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 mt-2">
                            <form>
                                <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <input className="form-control bg-light" placeholder="First name" type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <input className="form-control bg-light" placeholder="Last name" type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                           <textarea className="form-control bg-light" placeholder="Your message" rows={4}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-grid">
                                            <button className="btn btn-primary" type="submit">Send message</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}