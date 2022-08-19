import React, { Component } from 'react';
import st from './cards.scss';
import locationIcon from '../../assets/svg/location-dot-solid.svg'

class Hello extends Component {
    constructor(props) {
        super(props)
        this.intiveTo = props.to
    }

    render() {
        return (
            <div className={st.top}>
                <div className={st.bg}>
                    <h1>We invite you to be with us <br/>as we begin our new life together</h1>
                    <p>Beloved daugther <br/> of Mr. & Mrs.Bandara</p>
                    <p className={st.couplename}> Vilochani & Asanka </p>
                    Beloved son of <br/> of Mr. & Mrs.Basnayake
                    <p> Warmly request the pleasure of </p>
                    <p className={st.inviteto}> {this.intiveTo} </p>
                    to celebrate our wedding 
                    <p className={st.date}> Monday 12, Sep. 2022</p>
                    <div className={st.locationsvgwrapper}> <img className={st.svg} src={locationIcon} alt='at'/></div>
                    <p> <a href="https://goo.gl/maps/nqPXoE3MhQDfjUXx6">Ruwanara Royal Majestry</a>
                    <br/> Dampelessa, Narammala 
                    <br/> from 8.30am to 4.00pm <br/> 
                    (Poruwa ceremony 10:48am)
                    </p>
                </div>
                <div className={st.bottom}> 
                    <p>RSVP Regrets only</p>
                    <p>Asanka - 071 618 9576 | Vilochani - 077 693 3389</p>

                </div>
            </div>
        )
    }
     
}

export default Hello