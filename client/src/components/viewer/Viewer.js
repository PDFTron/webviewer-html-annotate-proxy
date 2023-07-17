import WebViewer from '@pdftron/webviewer';
import { initializeHTMLViewer } from '@pdftron/webviewer-html';
import React, { useContext, useEffect, useRef, useState } from 'react';
import WebViewerContext from '../../context/webviewer';
import './Viewer.css';

const Viewer = ({ res, loadURL }) => {
  const viewer = useRef(null);
  const [HTMLModule, setHTMLModule] = useState(null);
  const { setInstance } = useContext(WebViewerContext);

  useEffect(() => {
    WebViewer(
      {
        path: '/lib',
        disableVirtualDisplayMode: true,
      },
      viewer.current
    ).then(async (instance) => {
      setInstance(instance);

      const { documentViewer, annotationManager } = instance.Core;
      const license = `---- Insert commercial license key here after purchase ----`;

      const mockedXFDF = `<?xml version="1.0" encoding="UTF-8" ?>\n<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">\n<fields />\n<add>\n<highlight page="0" rect="229,1001.563,507.078,1037.563" color="#FFCD45" flags="print" name="d01cfe5e-810f-59a4-8f01-ea76df6f4c98" title="Guest" subject="Highlight" date="D:20230714112127-07'00'" creationdate="D:20230714112126-07'00'" coords="248.53125,1037.5625,507.078125,1037.5625,248.53125,1019.5625,507.078125,1019.5625,229,1019.5625,364.953125,1019.5625,229,1001.5625,364.953125,1001.5625"><trn-custom-data bytes="{&quot;trn-annot-preview&quot;:&quot;d and appreciate pages created by others\\ndevelop an understan&quot;}"/></highlight>\n<highlight page="0" rect="189,609.031,1251,645.031" color="#00CC63" flags="print" name="ed926e15-c789-cba7-c57b-c084baee874d" title="Guest" subject="Highlight" date="D:20230714112129-07'00'" creationdate="D:20230714112129-07'00'" coords="310.75,645.03125,1251,645.03125,310.75,627.03125,1251,627.03125,189,627.03125,390.25,627.03125,189,609.03125,390.25,609.03125"><trn-custom-data bytes="{&quot;trn-annot-preview&quot;:&quot;ics\\nindicates where you can insert your own text, other information is HTML and needs to be exact. However, make sure there are no spaces between the tag brackets and th&quot;}"/></highlight>\n</add>\n<modify />\n<delete />\n</xfdf>`;

      const fetchMockData = (isFetchSuccessful) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (isFetchSuccessful) {
              resolve({ status: 200, data: mockedXFDF });
            } else {
              reject('Error');
            }
          }, 2000);
        });
      }

      const xfdfStrings = async (ucdid) => {
        const res = await fetchMockData(true);
        if (res.status === 200) {
          console.log('fetch success')
          const xfdfStrings = await res.data;
          return xfdfStrings;
        }
      };

      documentViewer.addEventListener('proxyLoaded', () => {
        setTimeout(async () => {
          const correctXFDFString = await xfdfStrings();
          console.log('start importing', correctXFDFString);
          const annots = await annotationManager.importAnnotationCommand(correctXFDFString);
          annots.forEach(annot => annotationManager.redrawAnnotation(annot));
        }, 5000);
      });

      const htmlModule = await initializeHTMLViewer(instance, { license });

      setHTMLModule(htmlModule);

      loadURL(`https://www.york.ac.uk/teaching/cws/wws/webpage1.html`);

    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (HTMLModule && Object.keys(res).length > 0) {
      const { iframeUrl, width, height, urlToProxy } = res;
      HTMLModule.loadHTMLPage({ iframeUrl, width, height, urlToProxy });
    }
  }, [HTMLModule, res]);

  return <div ref={viewer} className="HTMLViewer"></div>;
};

export default Viewer;
