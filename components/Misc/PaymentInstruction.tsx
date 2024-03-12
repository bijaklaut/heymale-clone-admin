export const PaymentInstruction = ({ bank }: { bank: string }) => {
  if (bank == "bca") return <InstructionsBCA />;
  if (bank == "bni") return <InstructionsBNI />;
  if (bank == "mandiri") return <InstructionsMandiri />;
  if (bank == "cimb") return <InstructionsCIMB />;
  if (bank == "bri") return <InstructionsBRI />;
  if (bank == "permata") return <InstructionsPermata />;
};

const InstructionsBCA = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Mobile Banking / m-BCA
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking / Klik BCA
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM BCA</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionsMandiri = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Mobile Banking Mandiri
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking Mandiri
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM Mandiri</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionsCIMB = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Mobile Banking CIMB
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking CIMB
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM CIMB</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionsBNI = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">Mobile Banking BNI</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking BNI
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM BNI</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionsPermata = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Mobile Banking Permata
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking Permata
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM Permata</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionsBRI = () => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm">How to Pay</span>
      <div className="flex flex-col gap-2">
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">Mobile Banking BRI</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Internet Banking BRI
          </div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
        <div className="collapse collapse-arrow rounded-md border border-white/50 bg-base-100 text-white shadow-md">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">ATM BRI</div>
          <div className="collapse-content">
            <p>Some instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
