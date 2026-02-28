import type Hubspot from 'hubspot'
import sinon from 'sinon'

type HubspotStubs = {
  update: sinon.SinonStub,
  updateByEmail: sinon.SinonStub,
  createOrUpdate: sinon.SinonStub,
  getById: sinon.SinonStub,
  getByEmail: sinon.SinonStub,
  merge: sinon.SinonStub,
}

const stubContactsUpdates = (hubspot: Hubspot): [() => void, () => void, () => HubspotStubs] => {
  let stubs: sinon.SinonStub[]
  const hubspotBefore = () => {
    stubs = [
      sinon.stub(hubspot.contacts, 'update').returns(null),
      sinon.stub(hubspot.contacts, 'updateByEmail').returns(null),
      sinon.stub(hubspot.contacts, 'createOrUpdate').returns(null),
      sinon.stub(hubspot.contacts, 'getById').returns(null),
      sinon.stub(hubspot.contacts, 'getByEmail').returns(null),
      sinon.stub(hubspot.contacts, 'merge').returns(null),
    ]
  }

  const hubspotAfter = () => {
    stubs.forEach(s => s.restore())
  }

  const getStubs = (): HubspotStubs => ({
    update: stubs[0],
    updateByEmail: stubs[1],
    createOrUpdate: stubs[2],
    getById: stubs[3],
    getByEmail: stubs[4],
    merge: stubs[5],
  })

  return [hubspotBefore, hubspotAfter, getStubs]
}

export {
  stubContactsUpdates,
}
