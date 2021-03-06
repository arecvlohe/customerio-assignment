import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4 header">
      <div className="flex justify-between max-w-4xl mx-auto">
        <div className="space-x-4">
          <Link href="/" passHref>
            <a>Customer.io</a>
          </Link>
        </div>
        <div className="space-x-4">
          <span>take-home@customer.io</span>
        </div>
      </div>
    </header>
  );
};
