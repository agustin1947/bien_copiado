import { useEffect } from 'react';

const SalesDetectChangesInItems = (props: any, ref: any) => {
  const { attribute, disabled, intlLabel, name, onChange, required, value } = props;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const buttonClosed  = document.querySelectorAll('form h3 button[aria-expanded="false"]');
      const divClosed     = document.querySelectorAll('form div[data-state=closed]');
      const buttonAction  = document.querySelectorAll("h3 span button[data-state=closed]"); 
      

      buttonClosed.forEach((button) => {
        (button as HTMLButtonElement).click();
      });
      buttonAction.forEach((button) => {
        button.classList.add('hidden-delete');
      })

    }, 500); // podés subirlo a 800 / 1000 si no aparece

    return () => clearTimeout(timer);
  }, []);

  /*useEffect(() => {
    const observer = new MutationObserver(() => {
      console.log('Detecting changes in items...');
      getTotals('.input_total_item_product', 'total');
      getTotals('.input_ganancia_item_product', 'total_ganancia');
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const getTotals = (totalsInput: string, totalsName: string) => {
    const totals = document.querySelectorAll(totalsInput);
    let total = 0;

    if (totals.length > 0) {
      for (const input of totals) {
        const val = parseFloat((input as HTMLInputElement).value);
        if (!isNaN(val)) {
          total += val;
        }
      }

      onChange({
        target: {
          name: totalsName,
          type: 'number',
          value: total,
        },
      });
    }
  };*/
  return ( 
    <></>
  )
};

export { SalesDetectChangesInItems };