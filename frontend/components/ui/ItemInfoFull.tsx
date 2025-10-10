// Name: 1 Cookie
// vendor: Crumbl
// Address: 123 Cookie Lane, Sweet Tooth City, CA 90210
// Desc. Enjoy a Crumbl Cookie on us! Thanks for helping out in your community!
// Cost: 20 coins
// eybelsbleb

export type ItemInfoProps = {
  name: string;
  vendor: string;
  address: string;
  description: string;
  cost: string;
};

export default function ItemInfo({
  name,
  vendor,
  address,
  description,
  cost,
}: ItemInfoProps) {
  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 100,
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            height: 126,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 37,
            display: 'flex',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              height: 57,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              display: 'flex',
            }}
          >
            <div
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 215,
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: 97,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 10,
                  display: 'inline-flex',
                }}
              >
                <div
                  style={{
                    width: 367,
                    color: 'black',
                    fontSize: 44,
                    fontFamily: 'Josefin Sans',
                    fontWeight: '400',
                    wordWrap: 'break-word',
                  }}
                >
                  {name}
                </div>
              </div>
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                flex: '1 1 0',
                color: 'black',
                fontSize: 32,
                fontFamily: 'Josefin Sans',
                fontWeight: '300',
                paddingBottom: 12,
                wordWrap: 'break-word',
              }}
            >
              {vendor}
            </div>
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              flex: '1 1 0',
              color: 'black',
              fontSize: 20,
              fontFamily: 'Josefin Sans',
              fontWeight: '300',
              paddingBottom: 12,
              wordWrap: 'break-word',
            }}
          >
            {address}
          </div>
          <div
            style={{
              width: 339,
              color: 'black',
              fontSize: 16,
              fontFamily: 'Josefin Sans',
              fontWeight: '300',
              paddingBottom: 12,
              wordWrap: 'break-word',
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            width: 163.33,
            height: 49,
            paddingLeft: 35,
            paddingRight: 35,
            paddingTop: 18,
            paddingBottom: 18,
            background: '#90D0CD',
            borderRadius: 16.33,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 22,
              fontFamily: 'Josefin Sans',
              fontWeight: '400',
              wordWrap: 'break-word',
            }}
          >
            {cost}
          </div>
        </div>
      </div>
    </>
  );
}
