const loadbalancer = {};

loadbalancer.ROUND_ROBIN = (service) => {
  const newIndex =
    ++service.registryServices.index >=
    service.registryServices.instances.length
      ? 0
      : service.index;
  service.registryServices.index = newIndex;
  return newIndex;
};

module.exports = loadbalancer;
