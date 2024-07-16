export const Footer = () => {
    return (
        <div>

            <footer className="text-center text-lg-start bg-body-tertiary text-muted">
                <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                    <div className="me-5 d-none d-lg-block">
                    </div>

                    <div>
                        <a href="https://www.facebook.com/7thang3" className="me-4 text-reset">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://github.com/tadangthanh" className="me-4 text-reset">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </section>

                <section className="">
                    <div className="container text-center text-md-start mt-5">
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    <i className="fas fa-gem me-3"></i>Thông tin
                                </h6>
                                <p>
                                    Đồ án xây dựng và phát triển phần mềm.
                                </p>
                            </div>



                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Liên kết
                                </h6>
                                <p>
                                    <a href="https://vnua.edu.vn/" className="text-reset">Học viện nông nghiệp</a>
                                </p>
                                <p>
                                    <a href="https://fita.vnua.edu.vn/" className="text-reset">Khoa công nghệ thông tin</a>
                                </p>
                            </div>

                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                                <p><i className="fas fa-home me-3"></i> Trâu quỳ, Gia Lâm, Hà Nội</p>
                                <p>
                                    <i className="fas fa-envelope me-3"></i>
                                    <a href="mailto:6655264@sv.vnua.edu.vn">6655264@sv.vnua.edu.vn</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    © 2024 Copyright:
                    <a className="text-reset fw-bold" href="https://daotao.vnua.edu.vn/">daotao.vnua.edu.vn</a>
                </div>
            </footer>
        </div>
    )
}