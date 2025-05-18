import { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  PaginationModule,
  TooltipModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  CellStyleModule
} from 'ag-grid-community';
import Papa from 'papaparse';
import { ExternalLink } from 'lucide-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  TooltipModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  CellStyleModule
]);
const headerStyle = document.createElement('style');
headerStyle.innerHTML = `
  #network-branding {
    width: 100vw;
    margin: 0;
    padding: 0;

    background-color: #531958;
    color: #fff;
    min-height: 30px;
    padding: 0.25rem 0;
  }
  #network-branding .container {
    max-width: 1140px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  #network-branding .masthead-logo {
    height: 20px;
    margin-left: 25px;
    margin-right: 0.5rem;
  }
  #network-branding .masthead-link {
    color: #fff;
    text-decoration: none;
    margin-right: 1rem;
    font-size: 0.75rem;
  }
  #network-branding .masthead-link span {
    white-space: nowrap;
  }
  @media (min-width: 769px) {
    #network-branding .masthead-link span.d-md-inline-block,
    #network-branding .masthead-link span.d-lg-inline-block,
    #network-branding .masthead-link span.d-xl-inline-block {
      display: inline-block;
    }
    #network-branding .masthead-link span.d-md-none,
    #network-branding .masthead-link span.d-lg-none,
    #network-branding .masthead-link span.d-xl-none {
      display: none;
    }
  }
  @media (max-width: 768px) {
    #network-branding .masthead-link span.d-md-inline-block,
    #network-branding .masthead-link span.d-lg-inline-block,
    #network-branding .masthead-link span.d-xl-inline-block {
      display: none;
    }
    #network-branding .masthead-link span.d-md-none,
    #network-branding .masthead-link span.d-lg-none,
    #network-branding .masthead-link span.d-xl-none {
      display: inline-block;
    }
  }
  #network-branding img[alt='divider'] {
    height: 30px;
  }
`;
document.head.appendChild(headerStyle);

export default function App() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [filters, setFilters] = useState({
    treatments: [],
    endpoint: [],
    lineage: []
  });

  const [expanded, setExpanded] = useState({
    treatments: false,
    endpoint: false,
    lineage: false
  });

const Header = () => (
  <>
    <header>
      <div id="network-branding" className="container-fluid text-white">
        <div className="container d-flex align-items-center py-1">
          <img src="/assets/images/masthead-hhs-logo.png" alt="HHS" className="masthead-logo" />
          <a href="https://www.hhs.gov/" className="masthead-link hhs-link">
            <span className="d-none d-xl-inline-block">U.S. Department of Health and Human Services</span>
            <span className="d-xl-none d-inline-block">HHS</span>
          </a>
          <img src="/assets/images/masthead-divider.png" alt="divider" className="masthead-divider" />
          <img src="/assets/images/masthead-nih-logo.png" alt="NIH" className="masthead-logo" />
          <a href="https://www.nih.gov/" className="masthead-link nih-link">
            <span className="d-none d-lg-inline-block">National Institutes of Health</span>
            <span className="d-lg-none d-inline-block">NIH</span>
          </a>
          <img src="/assets/images/masthead-divider.png" alt="divider" className="masthead-divider" />
          <img src="/assets/images/masthead-nih-logo.png" alt="NCATS" className="masthead-logo" />
          <a href="https://www.ncats.nih.gov/" className="masthead-link ncats-link">
            <span className="d-none d-md-inline-block">National Center for Advancing Translational Sciences</span>
            <span className="d-md-none d-inline-block">NCATS</span>
          </a>
        </div>
      </div>
      <div className="brand-container container-fluid bg-white py-3">
        <div className="container d-flex align-items-center gap-3" style={{ paddingTop: '24px', paddingLeft: '24px' }}>
          <img src="/assets/images/ncats.svg" alt="NCATS logo" style={{ height: '50px', marginRight: '16px' }} />
          <a href="/covid19" style={{ color: '#531958', fontSize: '2rem', fontWeight: 'bold', textDecoration: 'none', lineHeight: '50px', borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>OpenData Portal</a>
        </div>
      </div>
    </header>
    <div style={{ height: '25px', backgroundColor: '#fff', borderRadius: '1em', border: '2px solid #77317d', margin: '1em auto 20px auto', padding: '0.8em 0.8em', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '960px' }}>
      <p style={{ paddingTop: '0px', textAlign: 'center', color: '#77317d' }}>
        This repository is under review for potential modification in compliance with Administration directives.
      </p>
    </div>
    <section style={{
      width: '100vw',
      backgroundImage: 'url(/assets/images/cells@2x-CLYDR37Q.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      padding: '2rem 1.5rem 1.5rem 1.5rem',
      textAlign: 'left',
      position: 'relative'}}>
      <div className="container">
        <h6 style={{ fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '0.25px' }}>OpenData Portal | SARS-CoV-2 Variants & Therapeutics</h6>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', fontFamily: 'PT Sans, sans-serif', color: '#feff00', margin: '0.5rem 0 0.5rem 0', display: 'inline-block' }}> Real-World Evidence Studies of COVID-19 Therapeutics</h1>
        <span style={{ marginLeft: '10px', backgroundColor: 'white', color: 'black', padding: '0.25rem 0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>
          Updated 222 days ago
        </span>
        <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0 }}> 
          Browse high-level summaries of real-world outcomes for EUA/FDA approved and revoked COVID-19 therapeutics.<br />
          <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>Which Real-World Evidence studies are being collected here?</a>
        </p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/data/realworld_evidence.csv" download style={{ backgroundColor: 'white', color: '#77317d', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold', border: '2px solid #77317d' }}>
            Download real-world evidence dataset here
          </a>
        </div>
        
      </div>
    </section>
  </>
);

const Footer = () => (
    <footer style={{ backgroundColor: '#531958', color: 'white', fontSize: '0.875rem', width: '100vw' }}>
          <div className="container" style={{ maxWidth: '100vw', margin: '0 auto', width: '100%' }}>
            <div className="row" style={{ marginLeft: '45px', padding: '2rem 2rem 2rem', display: 'flex', justifyContent: 'space-between' }}>
              <div className="col-md-4 mb-4">
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>HOME</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>ABOUT</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>DATA EXPLORER</a></li>
                </ul>
              </div>
              <div className="col-md-4 mb-4">
                <ul style={{ borderLeft: 'solid 1px #CCCCCC', listStyle: 'none', paddingLeft: '20px' }}>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>NIH HOME</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>NCATS HOME</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>PRIVACY NOTICE</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>DISCLAIMER</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>HHS VULNERABILITY DISCLOSURE</a></li>
                  <li><a href="#" style={{ color: 'white', textDecoration: 'underline' }}>ACCESSIBILITY</a></li>
                </ul>
              </div>
              <div className="col-md-4 col-lg-4">
                <div style={{ backgroundColor: '#6c2d6b', padding: '1rem', borderRadius: '4px', marginRight: '8rem'}}>
                  <p>If you have problems viewing PDF files, download the latest version of <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>Adobe Reader</a>.</p>
                  <p>For language access assistance, contact the <a href="#" style={{ color: 'white', textDecoration: 'underline' }}>NCATS Public Information Officer</a>.</p>
                  <p>National Center for Advancing Translational Sciences (NCATS), 6701 Democracy Boulevard, Bethesda, MD 20892-4874 | 📞 301-594-8966</p>
                </div>
              </div>
            </div>
        <div style={{ backgroundColor: '#6c2d6b', borderTop: '1px solid #79457c', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: '5rem' }}>
            <img src="/assets/images/NIH-SVG.svg" alt="NIH logo" style={{ height: '40px' }} />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'center', fontWeight: '400' }}>
            © Copyright 2025, NCATS All rights reserved.
          </div>
        </div>
      </div>
    </footer>
);

  const ExternalLinkRenderer = ({ value }) => {
    if (!value) return null;
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#007bff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          textDecoration: 'none'
        }}
      >
        Link <ExternalLink size={16} strokeWidth={2} />
      </a>
    );
  };

  const toggleExpand = key => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetch('/data/realworld_evidence.csv')
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        setRowData(parsed.data);
        setFilteredData(parsed.data);

        setColumnDefs([
          { headerName: 'Title', field: 'data_title', tooltipField: 'data_title' },
          { headerName: 'Author', field: 'first_author', tooltipField: 'first_author' },
          {
            headerName: 'Publication Date',
            field: 'data_date',
            tooltipField: 'data_date',
            valueFormatter: params => {
              const raw = params.value;
              if (!raw) return '';
              const date = new Date(raw);
              if (isNaN(date.getTime())) return raw;
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              const yy = date.getFullYear().toString().slice(-2);
              return `${mm}/${dd}/${yy}`;
            },
            cellClass: 'ag-left-aligned-cell'
          },
          { headerName: 'Treatment (n)', field: 'treatments_compiled_edited' },
          {
            headerName: 'Study Start',
            field: 'study_start',
            valueFormatter: params => {
              const raw = params.value;
              if (!raw) return '';
              const date = new Date(raw);
              if (isNaN(date.getTime())) return raw;
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              const yy = date.getFullYear().toString().slice(-2);
              return `${mm}/${dd}/${yy}`;
            },
            cellClass: 'ag-left-aligned-cell'
          },
          {
            headerName: 'Study End',
            field: 'study_end',
            valueFormatter: params => {
              const raw = params.value;
              if (!raw) return '';
              const date = new Date(raw);
              if (isNaN(date.getTime())) return raw;
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              const yy = date.getFullYear().toString().slice(-2);
              return `${mm}/${dd}/${yy}`;
            },
            cellClass: 'ag-left-aligned-cell'
          },
          { headerName: 'Summary', field: 'summary' },
          { headerName: 'Viral Lineage', field: 'lineage' },
          { headerName: 'Hospitalization Endpoint', field: 'hospitalization_endpoint' },
          { headerName: 'Mortality Endpoint', field: 'mortality_endpoint' },
          { headerName: 'Other Endpoint', field: 'other_endpoint' },
          { headerName: 'Mortality Metric', field: 'mortality_metric_used' },
          { headerName: 'Mortality Outcome (value (95% CI); p-value)', field: 'mortality_endpt_metric_pvalue', tooltipField: 'mortality_endpt_metric_pvalue' },
          { headerName: 'Other Metric', field: 'other_metric_used', tooltipField: 'other_metric_used' },
          { headerName: 'Other Defined', field: 'other_defined', tooltipField: 'other_defined' },
          { headerName: 'Other Outcome (value (95% CI); p-value)', field: 'other_endpoint_metric_pvalue', tooltipField: 'other_endpoint_metric_pvalue' },
          { headerName: 'Cohort Type', field: 'cohort_uniqueness', tooltipField: 'cohort_uniqueness' },

          { headerName: 'Source', field: 'data_source' },
          {
            headerName: 'Link',
            field: 'citation',
            cellRenderer: 'externalLinkRenderer'
          }
        ]);
      });
  }, []);

  const uniqueValues = useMemo(() => {
    const treatments = [...new Set(
      rowData.flatMap(row =>
        (row.treatments_compiled_formula || '')
          .split(';')
          .map(t => t.trim())
          .filter(t =>
            t &&
            t !== '' &&
            !t.toLowerCase().startsWith('n/a') &&
            !t.toLowerCase().startsWith('control')
          )
          .map(t => t.replace(/\s*\([^)]*\)/g, '').trim())
      )
    )];

    const lineage = [...new Set(rowData.map(d => d.lineage).filter(v => v && v.trim() !== ''))];
    return { treatments, lineage };
  }, [rowData]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  useEffect(() => {
    const filtered = rowData.filter(row => {
      const treatmentList = (row.treatments_compiled_formula || '')
        .split(';')
        .map(t => t.trim())
        .filter(t =>
          t &&
          t !== '' &&
          !t.toLowerCase().startsWith('n/a') &&
          !t.toLowerCase().startsWith('control')
        )
        .map(t => t.replace(/\s*\([^)]*\)/g, '').trim());

      const treatMatch =
        filters.treatments.length === 0 ||
        treatmentList.some(val => filters.treatments.includes(val));

      const endMatch =
        filters.endpoint.length === 0 ||
        filters.endpoint.some(endpoint => row[endpoint] && row[endpoint].toLowerCase() === 'yes');

      const lineageMatch =
        filters.lineage.length === 0 || filters.lineage.includes(row.lineage);

      return treatMatch && endMatch && lineageMatch;
    });
    setFilteredData(filtered);
  }, [filters, rowData]);

  return (
    <>
     <Header />
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside style={{ width: '300px', padding: '1rem 1rem 1rem 5px', backgroundColor: '#f8f9fa', borderRight: '1px solid #ddd', textAlign: 'left', flexShrink: 0 }}>
        <h4 style={{ color: '#006666', marginBottom: '0.5rem', textAlign: 'left' }}>FILTER BY</h4>
        <hr style={{ borderColor: '#ccc', marginBottom: '1rem' }} />

        {/* Treatments filter */}
        <div>
          <div onClick={() => toggleExpand('treatments')} style={{ cursor: 'pointer', color: '#006666', fontWeight: 'bold', textAlign: 'left' }}>
            Treatments <span style={{ float: 'right' }}>{expanded.treatments ? '\u25BC' : '\u25B6'}</span>
          </div>
          {expanded.treatments && (
            <div style={{ marginLeft: '1rem', textAlign: 'left' }}>
              {uniqueValues.treatments.map(val => (
                <label key={val} style={{ display: 'block', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={filters.treatments.includes(val)}
                    onChange={() => handleFilterChange('treatments', val)}
                  />{' '}
                  {val}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Endpoint filter */}
        <div style={{ marginTop: '1rem' }}>
          <div onClick={() => toggleExpand('endpoint')} style={{ cursor: 'pointer', color: '#006666', fontWeight: 'bold', textAlign: 'left' }}>
            Endpoint <span style={{ float: 'right' }}>{expanded.endpoint ? '\u25BC' : '\u25B6'}</span>
          </div>
          {expanded.endpoint && (
            <div style={{ marginLeft: '1rem', textAlign: 'left' }}>
              {[
                { label: 'Hospitalization', field: 'hospitalization_endpoint' },
                { label: 'Mortality', field: 'mortality_endpoint' },
                { label: 'Other', field: 'other_endpoint' }
              ].map(opt => (
                <label key={opt.field} style={{ display: 'block', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={filters.endpoint.includes(opt.field)}
                    onChange={() => handleFilterChange('endpoint', opt.field)}
                  />{' '}
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Lineage filter */}
        <div style={{ marginTop: '1rem' }}>
          <div onClick={() => toggleExpand('lineage')} style={{ cursor: 'pointer', color: '#006666', fontWeight: 'bold', textAlign: 'left' }}>
            Lineage (Variant) <span style={{ float: 'right' }}>{expanded.lineage ? '\u25BC' : '\u25B6'}</span>
          </div>
          {expanded.lineage && (
            <div style={{ marginLeft: '1rem', textAlign: 'left' }}>
              {uniqueValues.lineage.map(val => (
                <label key={val} style={{ display: 'block', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={filters.lineage.includes(val)}
                    onChange={() => handleFilterChange('lineage', val)}
                  />{' '}
                  {val}
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'left' }}>{filteredData.length} Records</h2>
        <div className="ag-theme-alpine" style={{ flex: 1 }}>
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            pagination={true}
            enableBrowserTooltips={true}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              cellStyle: { textAlign: 'left' }
            }}
            components={{
              externalLinkRenderer: ExternalLinkRenderer
            }}
          />
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
