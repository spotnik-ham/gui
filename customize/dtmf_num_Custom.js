//import React from 'react'

/*	Insérer ci-dessous, tous les SALONS NUMERIQUES que vous souhaitez ajouter 
            à la liste de la page DTMFCOMMANDS
            Le format est celui du fichier dtmfcmd.js, c'est à dire : 
            
            const DTMF_Y_Custom = {
                'Description du Salon': 'Code DTMF',
            }   
            
            
*/

// Salons YSF, C4FM, P25, NXDN
export const DTMF_Y_Custom = {
    'YSF FRANCE': '3000',
    'YSF IDF': '3001',
    'YSF XLX 208': '3002',
    'YSF Room-ZIT': '3003',
    'YSF Centre France': '3004',
    'YSF Alpes': '3005',
    'YSF Wallonie': '3006',
    'YSF Haut de France': '3007',
    'YSF Linux': '3008',
    'YSF Test': '3009',
    'YSF FRA Wide': '3010',
    'YSF Emcom FR': '3012',
    'YSF NordOuest': '3029',
    'YSF Canada Fr': '3030',
    'YSF Cq Canada': '3031',
    'YSF DMRQ Ca': '3032',
    'YSF Nantes': '3044',
    'YSF HB9VD': '3066',
    'YSF Wirex': '3090',
    'YSF FON': '3097',
    'YSF INTERNATIONAL-RRF': '3099',
    'P25 France': '10208',
    'P25 Canada Fr': '40721',
    'NXDN France': '65208',
};

// Salons DMR, D-STAR
export const DCustom = {
    'DMR France': '208',
    'DMR Urgence': '2080',
    'DMR IDF': '2081',
    'DMR Nord Ouest': '2082',
    'DMR Nord Est': '2083',
    'DMR Sud Est': '2084',
    'DMR Sud Ouest': '2085',
    'DMR DOM-TOM': '2089',
    'DMR 208 00': '20800',
    'DMR 208 25': '20825',
    'DMR 208 44': '20844',
    'DMR 208 54': '20854',
    'DMR 208 60': '20860',
    'DMR 208 67': '20867',
    'DMR 208 79': '20879',
    'D-Star 933C': '933',
};

// Dashboards numériques
export const DTMFDashboardsCustom = () => (
    <>
        <li><a href="http://rrf.f5nlg.ovh/" target="_blank">99 International Site du RRF</a></li>
        <li><a href="http://ysf-france.fr" target="_blank">3000 YSF France</a></li>
        <li><a href="http://ysf-idf.f1tzo.com:81" target="_blank">3001 YSF Ile de France</a></li>
        <li><a href="https://xlx208.f5kav.fr/index.php" target="_blank">3002 YSF XLX208</a></li>
        <li><a href="http://151.80.143.185/zit/YSFReflector-Dashboard/" target="_blank">3003 YSF Room ZIT</a></li>
        <li><a href="http://ysf-centre-france.f1tzo.com:81/" target="_blank">3004 YSF Centre France</a></li>
        <li><a href="http://ysf-alpes.f4gve.net/" target="_blank">3005 YSF Alpes</a></li>
        <li><a href="http://www.ysfwallonie.net/ " target="_blank">3006 YSF Wallonie</a></li>
        <li><a href="https://srv.hambox.fr/hdf-dashboard/" target="_blank">3007 YSF Haut de France</a></li>
        <li><a href="http://vps.hambox.fr/ysf-linux-fr/" target="_blank">3008 YSF Linux</a></li>
        <li><a href="http://vps731279.ovh.net/" target="_blank">3009 YSF Test</a></li>
        <li><a href="http://ns3294400.ovh.net/YSFDashboard/" target="_blank">3010 YSF Fra Wide</a></li>
        <li><a href="http://158.69.169.205/" target="_blank">3030 YSF Canada Fr </a></li>
        <li><a href="https://cqcanada.420hamradio.network/" target="_blank">3031 YSF Cq Canada</a></li>
        <li><a href="http://dmrq.ca/" target="_blank">3032 YSF Dmrq Canada</a></li>
        <li><a href="http://www.f5ore.dyndns.org/" target="_blank">3044 YSF Nantes </a></li>
        <li><a href="http://reflector.hb9vd.ch/ysf/" target="_blank">3066 YSF HB9VD </a></li>
        <li><a href="http://151.80.143.185/WXF/YSFReflector-Dashboard/index.php/" target="_blank">3090 YSF FRa Wirex </a></li>
        <li><a href="http://ysf-fon-gateway.f1tzo.com:81/" target="_blank">3097 YSF FON </a></li>
        <li><a href="http://ysf-international-rrf.f1tzo.com:81/" target="_blank">3099 YSF International-RRF</a></li>

        <p></p>

        <li><a href="http://ysf-france.fr/p25/ " target="_blank">10208 P25 France</a></li>

        <p></p>

        <li><a href="http://ysf-france.fr/nxdn/" target="_blank">65208 NXDN France</a></li>

        <p></p>

        <li><a href="http://164.132.195.103/ipsc/index.html#" target="_blank">DMR IPSC2 France</a></li>
        <li><a href="https://brandmeister.network/?page=lh" target="_blank">DMR BM</a></li>

        <p></p>

        <li><a href="http://dcs033.xreflector.net/index.php" target="_blank">933 D-Star DCS033 </a></li>

    </>
)






