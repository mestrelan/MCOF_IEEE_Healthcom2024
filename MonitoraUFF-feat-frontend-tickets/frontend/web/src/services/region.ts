import  api  from "./api.ts";

export function apiRegion() {

    async function addRegion(newRegion: any) {

        return await api.post('api/region', newRegion)

    }

    async function getAllRegions() {

        return await api.get('api/regions')

    }

    async function getRootRegions() {

        return await api.get('api/region')

    }

    async function getRootRegionById(id: any) {

        return await api.get(`api/region/${id}`)

    }

    async function getRegion(id: any) {

        return await api.get(`api/region/${id}`)

    }

    async function getRegionByID(id: any) {

        return await api.get(`api/regions/${id}`)

    }

    async function deleteRegion(id: any) {

        return await api.delete(`api/region/${id}`)

    }

    async function updateRegion(id: any, updatedData: any, config: any) {

        return await api.put(`api/region/${id}`, updatedData, config)

    }

    return {
        addRegion,
        getAllRegions,
        getRootRegions,
        getRegionByID,
        getRegion,
        deleteRegion,
        updateRegion,
        getRootRegionById
    }

}